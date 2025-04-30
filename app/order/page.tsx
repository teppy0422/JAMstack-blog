"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  useTheme,
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  useColorMode,
  Tabs,
  TabList,
  Tab,
  Image,
  SimpleGrid,
  useBreakpointValue,
  HStack,
  useToast,
  Center,
  Tooltip,
  Flex,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
import { useUserContext } from "../../context/useUserContext";
import Content from "../../components/content";
import { AnimationImage } from "../../components/CustomImage";
import FilteredImage from "../../components/PosterImage";
import HachisukaAnimation from "../../components/season/HachisukaAnimation";
import {
  CustomSwitchButton,
  CustomSwitchMultiButton,
} from "../../components/custom/CustomSwitchButton";
import {
  CATEGORY_CONFIG,
  searchCategoryBg,
  searchCategoryColor,
} from "../utils/categoryConfig";

import "@fontsource/yomogi";
import * as d3 from "d3";
import React from "react";
import cloud from "d3-cloud";
import { StarIcon } from "@chakra-ui/icons";
import { FaStar } from "react-icons/fa";
import { FaAnglesDown } from "react-icons/fa6";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  imageUrlSub: string;
  ingredients: string[];
  estimated_time: number;
  nameColor: string;
  recommendation_level: number;
  isSoldOut: boolean;
}

interface OrderItem {
  menu_item_id: number;
  quantity: number;
  price: number;
  status: "pending" | "completed";
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Word {
  text: string;
  value: number;
}

interface WordCloudComponentProps {
  words: Word[];
  options: {
    rotations: number;
    rotationAngles: number[];
    fontSizes: number[];
    fontFamily: string;
    fontWeight: string;
    padding: number;
    enableTooltip: boolean;
    deterministic: boolean;
    transitionDuration: number;
  };
  onWordClick: (word: { text: string }) => void;
  onWordMouseOver: (
    word: { text: string; value: number },
    event: React.MouseEvent<Element>
  ) => void;
  onWordMouseOut: () => void;
  findRelatedItem: (text: string) => MenuItem | undefined;
  size: number[];
}

export default function OrderPage() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [positions, setPositions] = useState<{
    [key: number]: { x: number; y: number; direction: string };
  }>({});
  const [shouldReposition, setShouldReposition] = useState(true);
  const gridColumns = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 4,
    lg: 4,
    xl: 5,
    "2xl": 6,
    "3xl": 7,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    currentUserId,
    currentUserPictureUrl,
    currentUserEmail,
    currentUserCreatedAt,
    getUserById,
    isLoading,
  } = useUserContext();
  const userData = currentUserId ? getUserById(currentUserId) : null;
  const [imageCache, setImageCache] = useState<{ [key: string]: string }>({});
  const [preloadedImages, setPreloadedImages] = useState<{
    [key: string]: HTMLImageElement;
  }>({});
  const [elementSizes, setElementSizes] = useState<{
    [key: number]: { width: number; height: number };
  }>({});
  const elementRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [isHover, setIsHover] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);

  // ワードクラウドのデータをメモ化
  const [wordCloudData, setWordCloudData] = useState<
    { text: string; value: number; category: string }[]
  >([]);

  const [tooltipData, setTooltipData] = useState<{
    text: string;
    value: number;
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const [orderHistory, setOrderHistory] = useState<any[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [mode, setMode] = useState(0); // 4モード用

  const svgSize = useBreakpointValue({
    base: { width: 300, height: 800 }, // 小さい画面用
    sm: { width: 600, height: 400 }, // スマートフォン用
    md: { width: 600, height: 500 }, // 中くらいの画面用
    lg: { width: 600, height: 600 }, // 大きい画面用
    xl: { width: 1100, height: 700 }, // 特大画面用
  }) || { width: 300, height: 500 }; // デフォルト値を設定

  const [scrollState, setScrollState] = useState({ left: 0, right: 0 });
  const scrollBoxRef = useRef<HTMLDivElement>(null);

  const colRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [rightPositions, setRightPositions] = useState<
    { key: string; right: number }[]
  >([]);

  const parentRef = useRef<HTMLDivElement | null>(null);

  const placedListRef = useRef<{ right: number; w: number }[]>([]);
  placedListRef.current = []; // 毎回初期化

  // const [prevRight, setPrevRight] = useState<number | null>(null);
  // const [prevWidth, setPrevWidth] = useState<number | null>(null);
  let prevRight: number | null = null;
  let prevWidth: number | null = null;
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // メニューアイテムのリアルタイム更新を設定
  useEffect(() => {
    const subscription = supabase
      .channel("menu_items")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_menu_items",
        },
        async (payload) => {
          console.log("メニューアイテムの変更:", payload);
          await fetchMenuItems();
        }
      )
      .subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    handleReposition();
  }, [menuItems]);

  // 初期データの取得
  const fetchOrderHistory = async () => {
    const { data, error } = await supabase
      .from("order_items")
      .select(
        `
          *,
          orders (
            total,
            created_at
          ),
          order_menu_items (
            name,
            price,
            image_url
          )
        `
      )
      .eq("orders.user_id", currentUserId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("注文履歴の取得に失敗:", error);
      return;
    }
    setOrderHistory(data || []);
  };

  // 注文履歴をリアルタイムで取得
  useEffect(() => {
    if (!currentUserId) return;
    fetchOrderHistory();

    // リアルタイムサブスクリプションの設定
    const subscription = supabase
      .channel("order_items")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_items",
          filter: `user_id=eq.${currentUserId}`,
        },
        async (payload) => {
          console.log("order_itemsテーブルの変更:", payload);
          await fetchOrderHistory();
        }
      )
      .subscribe();

    // クリーンアップ
    return () => {
      subscription.unsubscribe();
    };
  }, [currentUserId]);

  // カテゴリ変更時の処理
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // カテゴリ変更時は再配置しない
  };

  // カートにアイテムを追加したときの処理
  const addToCart = useCallback((item: MenuItem, mode: number) => {
    if (item.isSoldOut) {
      toast({
        duration: 3000,
        isClosable: true,
        render: () => (
          <Box
            p={3}
            backgroundImage={
              colorMode === "light"
                ? "url('/images/common/paperFFF.webp')"
                : "url('/images/common/paper181d26.png')"
            }
            color="#666" // 文字色
            fontWeight="600" // フォント太さ
            fontSize="lg" // フォントサイズ
            borderRadius="md" // 丸み
            boxShadow="lg" // 影
            textAlign="center"
            sx={{
              fontFamily: mode === 0 ? "Yomogi" : "'Yuji Syuku'",
            }}
          >
            {mode === 0
              ? "売り切れちゃいました"
              : mode === 1
              ? "品切れとなりました"
              : mode === 2
              ? "ごめんなさい☕️ただいま売り切れです"
              : "品切れでございます"}
          </Box>
        ),
      });
      return;
    }

    console.log("カートに追加するアイテム:", item);
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.item.id === item.id
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
  }, []);

  // カートからアイテムを削除する関数
  const removeFromCart = (itemId: number) => {
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem.item.id !== itemId)
    );
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.item.price * item.quantity,
      0
    );
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "エラー",
        description: "カートが空です",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!currentUserId) {
      toast({
        title: "エラー",
        description: "ログインが必要です",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 注文IDを生成
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            total: calculateTotal(),
            status: "pending",
            user_id: currentUserId,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 各メニューアイテムを個別に登録
      const orderItems: OrderItem[] = cart.map((item) => ({
        menu_item_id: item.item.id,
        quantity: item.quantity,
        price: item.item.price,
        user_id: currentUserId,
        status: "pending",
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(
        orderItems.map((item) => ({
          ...item,
          order_id: orderData.id,
        }))
      );

      if (itemsError) throw itemsError;

      toast({
        title: "注文完了",
        description: "注文が送信されました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setCart([]);

      // 注文履歴を即時更新
      const { data: updatedHistory, error: historyError } = await supabase
        .from("order_items")
        .select(
          `
          *,
          orders (
            total,
            created_at
          ),
          order_menu_items (
            name,
            price,
            image_url
          )
        `
        )
        .eq("orders.user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (!historyError) {
        setOrderHistory(updatedHistory || []);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "エラー",
        description: "注文の送信に失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 画像のプリロード関数を追加
  const preloadImage = useCallback(
    (url: string) => {
      if (!preloadedImages[url]) {
        const img = document.createElement("img");
        img.src = url;
        img.crossOrigin = "anonymous"; // CORS対応
        setPreloadedImages((prev) => ({ ...prev, [url]: img }));
      }
    },
    [preloadedImages]
  );

  // fetchMenuItemsを修正
  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from("order_menu_items")
      .select("*, image_url_sub")
      .eq("is_visible", true)
      .order("id", { ascending: true });

    if (error) {
      toast({
        title: "エラー",
        description: "メニューアイテムの取得に失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // すべての画像をキャッシュに保存し、プリロード
    const itemsWithCorrectImageUrl =
      data
        ?.sort((a, b) => {
          const orderA = CATEGORY_CONFIG[a.category]?.order || 0;
          const orderB = CATEGORY_CONFIG[b.category]?.order || 0;
          return orderA - orderB;
        })
        .map((item) => {
          const imageUrl = item.image_url;
          const imageUrlSub = item.image_url_sub;

          // 画像をキャッシュに追加
          if (!imageCache[imageUrl]) {
            setImageCache((prev) => ({ ...prev, [imageUrl]: imageUrl }));
            // メイン画像をプリロード
            preloadImage(imageUrl);
          }

          // サブ画像もプリロード
          if (imageUrlSub && !imageCache[imageUrlSub]) {
            setImageCache((prev) => ({ ...prev, [imageUrlSub]: imageUrlSub }));
            preloadImage(imageUrlSub);
          }

          // nameColorの設定を確認
          const nameColor = searchCategoryColor(item.category);

          return {
            ...item,
            imageUrl: imageUrl,
            imageUrlSub: imageUrlSub,
            nameColor: nameColor,
          };
        }) || [];
    setMenuItems(itemsWithCorrectImageUrl);
    console.log("menuItemsの状態:", itemsWithCorrectImageUrl); // 状態を確認
  };

  const categories = [
    "すべて",
    ...Array.from(new Set(menuItems.map((item) => item.category))).sort(
      (a, b) => {
        const orderA = CATEGORY_CONFIG[a]?.order ?? Infinity;
        const orderB = CATEGORY_CONFIG[b]?.order ?? Infinity;
        return orderA - orderB;
      }
    ),
  ];

  const displayCategories = categories.filter((c) => c !== "すべて");

  const filteredItems =
    selectedCategory === "すべて"
      ? menuItems
          .map((item) => ({
            ...item,
            imageUrl: imageCache[item.imageUrl] || item.imageUrl,
          }))
          .sort((a, b) => {
            const orderA = CATEGORY_CONFIG[a.category]?.order ?? Infinity;
            const orderB = CATEGORY_CONFIG[b.category]?.order ?? Infinity;

            if (orderA !== orderB) {
              return orderA - orderB;
            }
            return (
              (b.recommendation_level ?? 0) - (a.recommendation_level ?? 0)
            );
          })
      : menuItems
          .filter((item) => item.category === selectedCategory)
          .map((item) => ({
            ...item,
            imageUrl: imageCache[item.imageUrl] || item.imageUrl,
          }))
          .sort(
            (a, b) =>
              (b.recommendation_level ?? 0) - (a.recommendation_level ?? 0)
          );

  useEffect(() => {
    if (svgRef.current) {
      drawWordCloud(wordCloudData, menuItems);
    }
  }, [wordCloudData, menuItems]);

  // wordCloudDataを更新
  const handleReposition = useCallback(() => {
    const data = menuItems
      .filter((item) => item.recommendation_level > 0) // おすすめ度が0より大きいものだけを表示
      .map((item) => ({
        text: item.name,
        value: Math.max(item.recommendation_level * 20, 10), // 最小サイズを10に設定
        category: item.category,
      }));
    console.log("wordCloudDataを更新:", data);
    setWordCloudData(data);
  }, [menuItems]);

  useEffect(() => {
    console.log("isHover state changed:", isHover);
  }, [isHover]);

  const findRelatedItem = (text: string) => {
    return menuItems.find((item) => item.name === text);
  };

  // 画面サイズがmdを超える場合にtrueを返す
  const isMdOrLarger = useBreakpointValue({ base: false, md: true });
  const isLgOrLarger = useBreakpointValue({ base: false, lg: true });

  const drawWordCloud = useCallback(
    (
      words: { text: string; value: number; category: string }[],
      menuItems: MenuItem[]
    ) => {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const layout = cloud()
        .size([svgSize.width, svgSize.height])
        .words(
          words
            .filter((d) => {
              const menuItem = menuItems.find((item) => item.name === d.text);
              return !menuItem?.isSoldOut;
            })
            .sort((a, b) => {
              const orderA = CATEGORY_CONFIG[a.category]?.order || 0;
              const orderB = CATEGORY_CONFIG[b.category]?.order || 0;
              return orderA - orderB;
            })
            .map((d) => ({
              text: d.text,
              size: d.value,
              category: d.category,
            }))
        )
        .padding(5)
        .rotate(() => (Math.random() > 0 ? 0 : 90))
        .fontSize((d) => d.size)
        .on("end", render);

      layout.start();

      function render(words: any) {
        const centerX = svgSize.width / 2;
        const centerY = svgSize.height / 2;

        const group = svg
          .append("g")
          .attr("transform", `translate(${centerX},${centerY})`);

        words.forEach((d, i) => {
          const wordGroup = group.append("g");

          const text = wordGroup
            .append("text")
            .style("font-size", "1px")
            .style("font-weight", "900")
            .style("fill", CATEGORY_CONFIG[d.category]?.bg || "#000")
            .style("cursor", "pointer")
            .style("pointer-events", "none")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(0,0) rotate(0)`)
            .text(d.text);
          text
            .transition()
            .duration(600)
            .delay(() => Math.random() * 800)
            .ease(d3.easeCubicOut)
            .style("font-size", `${d.size}px`)
            .attr("transform", `translate(${d.x},${d.y}) rotate(${d.rotate})`)
            .on("end", function () {
              const textEl = text.node() as SVGTextElement;
              const bbox = textEl.getBBox();
              const transform = text.attr("transform");

              // 背面にrectを追加（先に描画）
              wordGroup
                .insert("rect", "text") // textの前（=背面）に挿入
                .attr("data-roof-id", "sakura")
                .datum(d)
                .attr("x", bbox.x)
                .attr("y", bbox.y)
                .attr("width", bbox.width)
                .attr("height", bbox.height)
                .attr("transform", transform)
                .style("fill", "transparent")
                .style("stroke", "transparent")
                .style("stroke-width", "1px")
                .style("pointer-events", "all")
                .style("cursor", "pointer")
                .on("click", (event, d) => {
                  const matched = menuItems.find(
                    (item) => item.name === d.text
                  );
                  if (matched) {
                    addToCart(matched, mode);
                  } else {
                    console.warn("一致するメニューが見つかりません:", d.text);
                  }
                })
                .on("mouseover", function (event) {
                  text
                    .raise() // グループ内のtextを前面へ
                    .transition()
                    .duration(500)
                    .attr("transform", `${transform} scale(1.1)`);
                  setTooltipData({
                    text: d.text,
                    value: d.value,
                    mouseX: event.clientX,
                    mouseY: event.clientY,
                  });
                })
                .on("mouseout", function () {
                  text.transition().duration(100).attr("transform", transform);
                  setTooltipData(null);
                });
            });
        });
      }
    },
    [svgSize]
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount);
  };

  // 注文履歴の表示部分
  const renderOrderHistory = () => {
    if (!orderHistory.length) return null;

    const calculateTotalAmount = () => {
      return orderHistory.reduce((total, item) => {
        const itemPrice = item.order_menu_items.price * item.quantity; // 各アイテムの合計金額
        return total + itemPrice;
      }, 0);
    };

    return (
      <Box mt={1} fontFamily="Yomogi">
        <Heading size="sm" mb={1}>
          <Flex align="center" position="relative" w="100%" top="8px">
            <Box
              flex="1"
              h="1px"
              bg={
                colorMode === "light"
                  ? "custom.theme.light.800"
                  : "custom.theme.dark.200"
              }
            />
            <Text
              px="4"
              zIndex="1"
              color={
                colorMode === "light"
                  ? "custom.theme.light.900"
                  : "custom.theme.dark.200"
              }
              bg={
                colorMode === "light"
                  ? "custom.theme.light.500"
                  : "custom.theme.dark.500"
              }
              fontWeight="bold"
            >
              履歴
            </Text>
            <Box
              flex="1"
              h="1px"
              bg={
                colorMode === "light"
                  ? "custom.theme.light.800"
                  : "custom.theme.dark.200"
              }
            />
          </Flex>
        </Heading>
        <VStack spacing={0} align="stretch">
          {orderHistory.map((item) => (
            <Box
              key={item.id}
              p={0}
              borderWidth="1px"
              borderRadius="md"
              borderColor="transparent"
              role="group"
              color={
                item.status === "completed"
                  ? colorMode === "light"
                    ? "custom.theme.light.800"
                    : "custom.theme.dark.400"
                  : colorMode === "light"
                  ? "custom.theme.light.900"
                  : "custom.theme.light.100"
              }
            >
              <HStack justify="space-between">
                <HStack>
                  {item.order_menu_items.image_url ? (
                    <Image
                      src={item.order_menu_items.image_url}
                      alt={item.order_menu_items.name}
                      boxSize="50px"
                      objectFit="cover"
                      borderRadius="md"
                      filter={
                        item.status === "completed"
                          ? "contrast(40%) brightness(110%) sepia(80%) saturate(30%)"
                          : "none"
                      }
                      _groupHover={{
                        filter: "none",
                        transition: "filter 0.2s ease-in-out",
                      }}
                    />
                  ) : (
                    <Center
                      minW="50px"
                      h="50px"
                      borderRadius="md"
                      fontWeight="600"
                      fontSize="sm"
                      color="custom.theme.light.800"
                      bg={
                        item.status === "completed"
                          ? "custom.theme.light.300"
                          : "custom.theme.light.600"
                      }
                      textAlign="center"
                      lineHeight="1.1"
                    >
                      NO <br />
                      IMAGE
                    </Center>
                  )}
                  <Box textAlign="left" width="100%" pl={2}>
                    <Text fontWeight="600">{item.order_menu_items.name}</Text>
                    <Text fontSize="sm" fontWeight="600">
                      {item.quantity}個 × {item.price}円
                    </Text>
                  </Box>
                </HStack>
                <VStack align="flex-end" spacing={0}>
                  <Text fontSize="xs" fontWeight="600">
                    {new Date(item.orders.created_at).toLocaleTimeString(
                      "ja-JP",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </Text>
                  <HStack spacing={0} fontSize="sm">
                    <Text fontWeight={900}>
                      {item.status === "completed" ? "提供済み" : "準備中"}
                    </Text>
                    {item.completed_at && (
                      <Text fontSize="xs">
                        (
                        {Math.floor(
                          (new Date(item.completed_at).getTime() -
                            new Date(item.created_at).getTime()) /
                            60000
                        )}
                        分)
                      </Text>
                    )}
                  </HStack>
                </VStack>
              </HStack>
              <Box
                h="0.5px"
                w="98%"
                mx="auto"
                my="5px"
                bg={
                  colorMode === "light"
                    ? "custom.theme.light.800"
                    : "custom.theme.dark.200"
                }
              />
            </Box>
          ))}
        </VStack>
        <Text
          fontSize="md"
          fontWeight="400"
          align="right"
          color={
            colorMode === "light"
              ? "custom.theme.light.950"
              : "custom.theme.light.100"
          }
        >
          合計: {formatCurrency(calculateTotalAmount())}
        </Text>
      </Box>
    );
  };

  const handleChangeMode = (idx: number) => {
    setMode(idx);
    if (idx === 1) handleReposition();
  };

  const half = Math.ceil(displayCategories.length / 2);
  const leftCategories = displayCategories.slice(0, half);
  const rightCategories = displayCategories.slice(half);

  const handleScroll = () => {
    if (!scrollBoxRef.current) return;
    const el = scrollBoxRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollState({ left: 0, right: 0 });
      return;
    }
    // 残り量 = 端までの距離 / 最大スクロール量
    const left = (maxScroll + el.scrollLeft) / maxScroll; // 0〜1に丸める
    const right = -el.scrollLeft / maxScroll; // 0〜1に丸める
    setScrollState({
      left,
      right,
    });
  };

  useEffect(() => {
    const el = scrollBoxRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      // 初期値
      handleScroll();
    }
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const soldOutRandomMap = useRef(new Map());
  const getSoldOutRandom = (itemId) => {
    if (!soldOutRandomMap.current.has(itemId)) {
      const randomTop = `${30 + Math.random() * 30}%`;
      const randomHeight = `${6 + Math.random() * 10}px`;
      soldOutRandomMap.current.set(itemId, { randomTop, randomHeight });
    }
    return soldOutRandomMap.current.get(itemId);
  };

  // カテゴリごとのランダム値（bottom, scale）を一括で管理
  const customCategoryRandomMap = useRef(new Map());
  const getCustomCategoryRandoms = (category) => {
    if (!customCategoryRandomMap.current.has(category)) {
      let categoryBottom, categoryScale, categoryRotation;
      categoryBottom = 5 + Math.floor(Math.random() * 50);
      categoryScale = 0.8 + Math.random() * 0.2; // 1以下になるようにする
      categoryRotation = 2 - Math.random() * 4;
      customCategoryRandomMap.current.set(category, {
        categoryBottom,
        categoryScale,
        categoryRotation,
      });
    }
    return customCategoryRandomMap.current.get(category);
  };

  useEffect(() => {
    const parentRight = parentRef.current
      ? parentRef.current.getBoundingClientRect().right
      : 0;
    const filteredEntries = Object.entries(colRefs.current).filter(([key]) =>
      key.includes("cat")
    );
    const positions = filteredEntries.map(([key, el]) => ({
      key,
      right:
        el && parentRef.current
          ? parentRight - el.getBoundingClientRect().right
          : 0,
    }));
    console.log(positions);
    setRightPositions(positions);
    placedListRef.current = [];
  }, [mode]);

  return (
    <>
      <Content isCustomHeader={true} maxWidth="100vw">
        <HachisukaAnimation />
        <Box p={2}>
          <Heading
            mb={4}
            textAlign="center"
            fontFamily="Yomogi"
            fontWeight="600"
          >
            <HStack
              justify="center"
              align="center"
              spacing={{ base: 0, sm: 1, md: 3 }}
            >
              <AnimationImage
                src="/images/illust/obj/oden2.gif"
                position="static"
                animation="sway 3s ease-in-out infinite"
                transformOrigin="top center"
                height="60px"
                sealSize="10"
              />
              <AnimationImage
                src="/images/illust/obj/oden2.gif"
                position="static"
                animation="sway 3s ease-in-out infinite"
                transformOrigin="top center"
                height="60px"
                sealSize="0"
              />
              <VStack gap={1}>
                {mode === 0 ? (
                  <Text>居酒屋ぼん</Text>
                ) : mode === 1 ? (
                  <Text>バーぼん</Text>
                ) : mode === 2 ? (
                  <Text>カフェぼん</Text>
                ) : (
                  <Text>料亭ぼん</Text>
                )}
                <CustomSwitchMultiButton
                  onClick={(idx) => handleChangeMode(idx)}
                  mode={mode}
                />
              </VStack>
              <Image
                src="/images/illust/obj/oden2.gif"
                height="60px"
                alt="おでん"
              />
              <AnimationImage
                src="/images/illust/obj/oden2.gif"
                position="static"
                animation="sway 3s ease-in-out infinite"
                transformOrigin="top center"
                height="60px"
                sealSize="0"
              />
            </HStack>
          </Heading>

          <Grid
            templateColumns={{
              base: "1fr",
              sm: "2fr",
              md: "4fr",
              lg: "1fr 6fr 2fr",
              xl: "1fr 6fr 2fr",
            }}
            gap={4}
          >
            <VStack spacing={4} align="center">
              {isLgOrLarger && (
                <Box
                  filter="drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.8))"
                  mt={mode === 0 || mode === 1 ? 7 : 4}
                >
                  <Box data-roof-id="sakura">
                    <FilteredImage
                      customImageUrl={
                        isHover && hoveredItem?.category === "アルコール"
                          ? hoveredItem?.imageUrlSub
                          : undefined
                      }
                    />
                  </Box>
                </Box>
              )}
            </VStack>
            <Box px={2}>
              {(mode === 0 || mode === 1) && (
                <Tabs variant="soft-rounded">
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    pb={1}
                    ml={0}
                  >
                    <TabList
                      overflowX="auto"
                      display="flex"
                      alignItems="center"
                      position="relative"
                    >
                      {categories.map((category) => (
                        <Tab
                          p="1"
                          key={category}
                          onClick={() => handleCategoryChange(category)}
                          position="relative"
                          _selected={{
                            bg: "transparent",
                          }}
                        >
                          <Box
                            position="relative"
                            zIndex={1}
                            textAlign="center"
                            lineHeight={1.1}
                            color={
                              colorMode === "light"
                                ? "custom.theme.light.900"
                                : "custom.theme.light.400"
                            }
                          >
                            <Box
                              position="absolute"
                              width="100%"
                              bottom="0"
                              bg={searchCategoryBg(category)[0]}
                              mt={0}
                              height={
                                selectedCategory === category ? "105%" : "3px"
                              }
                              transition="all 0.3s ease-in-out"
                            />
                            <Box
                              zIndex={2}
                              position="relative"
                              color={
                                selectedCategory === category
                                  ? searchCategoryColor(category)[0]
                                  : colorMode === "light"
                                  ? "custom.theme.light.850"
                                  : "custom.theme.light.400"
                              }
                              transition="all 0.2s ease-in-out"
                            >
                              {category}
                            </Box>
                          </Box>
                        </Tab>
                      ))}
                    </TabList>
                  </Flex>
                </Tabs>
              )}

              {mode === 0 && (
                <SimpleGrid
                  columns={gridColumns}
                  spacing={4}
                  fontFamily="Yomogi"
                  fontWeight="600"
                >
                  {filteredItems.map((item) => (
                    <Tooltip
                      label={
                        item.imageUrlSub &&
                        item.category !== "アルコール" && (
                          <>
                            <Box>
                              <Image src={item.imageUrlSub} />
                            </Box>
                          </>
                        )
                      }
                      bg="white"
                      borderRadius="md"
                      p="6px"
                      hasArrow
                    >
                      <Button
                        key={item.id}
                        onClick={() => addToCart(item, mode)}
                        p={0}
                        m={0}
                        h="auto"
                        bg="transparent"
                        _hover={{
                          transition: "transform 0.2s ease",
                          filter: "none",
                        }}
                        cursor={item.isSoldOut ? "default" : "pointer"}
                        onMouseEnter={() => {
                          setIsHover(true);
                          setHoveredItem(item);
                        }}
                        onMouseLeave={() => {
                          setIsHover(false);
                          setHoveredItem(null);
                        }}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        <Box
                          data-roof-id="sakura"
                          position="relative"
                          overflow="hidden"
                          height="120px"
                          width="180px"
                          filter={
                            item.isSoldOut ? "sepia(1) contrast(0.9)" : "none"
                          }
                        >
                          {item.imageUrl ? (
                            <AnimationImage
                              src={item.imageUrl}
                              height="100%"
                              width="100%"
                              objectFit="cover"
                              position="static"
                            />
                          ) : (
                            <Center
                              width="100%"
                              height="100%"
                              color="custom.theme.light.850"
                              bg="custom.theme.light.200"
                              fontSize={"2xl"}
                            >
                              NO IMAGE
                            </Center>
                          )}
                          {item.recommendation_level >= 4 && (
                            <Box
                              position="absolute"
                              top="0"
                              left="0"
                              transform="rotate(-40deg) translate(-46%, 100%)"
                              transformOrigin="top left"
                              bg={searchCategoryBg(item.category)[0]}
                              filter="drop-shadow(0 1px 10px rgba(0, 0, 0, 0.1))"
                              color="white"
                              px={5}
                              py={0.5}
                              fontSize="10px"
                              fontWeight="600"
                              border="1px solid white"
                              zIndex={1}
                              boxShadow="md"
                              width="120px"
                              textAlign="center"
                              lineHeight="1"
                            >
                              <HStack
                                spacing={
                                  item.recommendation_level === 4.5 ? 1.5 : 0.5
                                }
                                justify="center"
                              >
                                {item.recommendation_level >= 4 && (
                                  <Icon as={FaStar} />
                                )}
                                {item.recommendation_level >= 4.5 && (
                                  <Icon as={FaStar} />
                                )}
                                {item.recommendation_level >= 5 && (
                                  <Icon as={FaStar} />
                                )}
                              </HStack>
                            </Box>
                          )}
                          {item.isSoldOut && (
                            <Box
                              position="absolute"
                              top="50%"
                              left="50%"
                              transform="translate(-50%, -50%)"
                              bg="rgba(0, 0, 0, 0.5)"
                              p={2}
                              width="100%"
                              height="100%"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text
                                fontSize="2xl"
                                color="white"
                                fontWeight="800"
                                textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
                              >
                                SOLD OUT
                              </Text>
                            </Box>
                          )}
                        </Box>
                        <Box
                          bg={searchCategoryBg(item.category)[0]}
                          h="4px"
                          w="180px"
                        />
                        <HStack
                          spacing={0.5}
                          align="center" // ← 縦方向中央揃え（上下中央）
                          justify="center" // ← 横方向中央揃え（左右中央）
                          w="100%"
                        >
                          <Text
                            textAlign="center"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            fontSize="clamp(10px, 3vw, 14px)" // ← 文字サイズを自動調整
                            minW={0} // ← overflowを効かせるために必要
                          >
                            {item.name}
                          </Text>
                        </HStack>

                        <Text fontSize="sm">{item.price}円</Text>
                        <Text
                          fontSize="xs"
                          color={
                            colorMode === "light" ? "gray.500" : "gray.400"
                          }
                        >
                          提供目安: {item.estimated_time}分
                        </Text>
                      </Button>
                    </Tooltip>
                  ))}
                </SimpleGrid>
              )}
              {mode === 1 && (
                <SimpleGrid columns={1}>
                  <Box mt={0} position="relative">
                    <Button
                      position="absolute"
                      top="0"
                      right="0"
                      onClick={handleReposition}
                      bg="transparent"
                      _hover={{
                        bg: "transparent",
                      }}
                      color="custom.theme.light.600"
                      size="sm"
                    >
                      再配置
                    </Button>
                    <Box
                      display="flex"
                      justifyContent="center"
                      border="1px solid"
                      borderColor={
                        colorMode === "light"
                          ? "custom.theme.light.600"
                          : "custom.theme.dark.600"
                      }
                      maxW={svgSize.width}
                      maxH={svgSize.height}
                    >
                      <svg
                        ref={svgRef}
                        width={svgSize.width}
                        height={svgSize.height}
                        style={{ overflow: "visible" }}
                      />
                    </Box>
                    {tooltipData && (
                      <Box
                        position="fixed"
                        bg="white"
                        borderRadius="md"
                        boxShadow="md"
                        mt="8px"
                        ml="18px"
                        p={2}
                        zIndex={10}
                        left={`${tooltipData.mouseX}px`}
                        top={`${tooltipData.mouseY}px`}
                        textAlign="center"
                      >
                        {(() => {
                          const relatedItem = findRelatedItem(tooltipData.text);
                          if (relatedItem) {
                            return (
                              <Flex direction="column">
                                {relatedItem.imageUrl ? (
                                  <Image
                                    src={
                                      relatedItem.imageUrlSub
                                        ? relatedItem.imageUrlSub
                                        : relatedItem.imageUrl
                                    }
                                    alt={relatedItem.name}
                                    width="240px"
                                    height="auto"
                                    objectFit="contain"
                                  />
                                ) : (
                                  <Center
                                    minW="80px"
                                    h="80px"
                                    borderRadius="md"
                                    fontWeight="600"
                                    fontSize="sm"
                                    color="custom.theme.light.800"
                                    bg="custom.theme.light.200"
                                    textAlign="center"
                                    lineHeight="1.1"
                                  >
                                    NO <br />
                                    IMAGE
                                  </Center>
                                )}
                                <Text fontWeight={600}>{tooltipData.text}</Text>
                                <Text fontSize="sm" fontWeight={400}>
                                  {relatedItem.price}円
                                </Text>
                                <Text
                                  fontSize="sm"
                                  fontWeight={600}
                                  color="gray"
                                >
                                  提供目安: {relatedItem.estimated_time}分
                                </Text>
                                <Text fontSize="sm">{tooltipData.value}</Text>
                                {relatedItem.isSoldOut && (
                                  <Text
                                    fontSize="sm"
                                    color="red.500"
                                    fontWeight="bold"
                                    mt={1}
                                  >
                                    売り切れ
                                  </Text>
                                )}
                              </Flex>
                            );
                          }
                          return null;
                        })()}
                      </Box>
                    )}
                  </Box>
                </SimpleGrid>
              )}

              {mode === 2 && (
                <Flex direction={{ base: "column", md: "row" }} gap={4} mt={4}>
                  {/* 左カラム */}
                  <Box flex={1} bg="custom.theme.light.300" p={4}>
                    {leftCategories.map((category) => (
                      <Box key={category} mb={4}>
                        <Text
                          fontWeight="600"
                          fontSize="30px"
                          mb={2}
                          fontFamily="yomogi"
                        >
                          {category}
                        </Text>
                        <Flex direction="column" gap={1}>
                          {menuItems
                            .filter((item) => item.category === category)
                            .map((item) => (
                              <Box key={item.id} p={2} fontWeight="400">
                                {item.name}
                              </Box>
                            ))}
                        </Flex>
                      </Box>
                    ))}
                  </Box>
                  {/* 右カラム */}
                  <Box flex={1} bg="green.100" p={4}>
                    {rightCategories.map((category) => (
                      <Box key={category} mb={4} fontFamily="Yomogi">
                        <Text fontWeight="bold" mb={2}>
                          {category}
                        </Text>
                        <Flex direction="column" gap={2}>
                          {menuItems
                            .filter((item) => item.category === category)
                            .map((item) => (
                              <Box
                                key={item.id}
                                bg="white"
                                p={2}
                                borderRadius="md"
                              >
                                {item.name}
                              </Box>
                            ))}
                        </Flex>
                      </Box>
                    ))}
                  </Box>
                </Flex>
              )}
              {mode === 3 && (
                <SimpleGrid columns={1}>
                  <Box position="relative" userSelect="none">
                    {/* 中央のスクロールエリア */}
                    <Box ref={parentRef}>
                      <Box
                        position="absolute"
                        left="0"
                        top="0"
                        width={`${100 * scrollState.left}px`}
                        height="100%"
                        pointerEvents="none"
                        zIndex="20"
                        background={
                          colorMode === "light"
                            ? "linear-gradient(to left, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,1) 100%)"
                            : "linear-gradient(to left, rgba(27,35,41,0) 0%, rgba(27,35,41,0.5) 40%, rgba(27,35,41,1) 100%)"
                        }
                      />
                      <Box
                        position="absolute"
                        right="0"
                        top="0"
                        width={`${100 * scrollState.right}px`}
                        height="100%"
                        pointerEvents="none"
                        zIndex="20"
                        background={
                          colorMode === "light"
                            ? "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 40%, rgba(255,255,255,1) 100%)"
                            : "linear-gradient(to right, rgba(27,35,41,0) 0%, rgba(27,35,41,0.5) 40%, rgba(27,35,41,1) 100%)"
                        }
                      />
                      <Box
                        ref={scrollBoxRef}
                        position="relative"
                        display="flex"
                        flexDirection="row-reverse"
                        alignItems="flex-start"
                        w="100%"
                        overflowX="auto"
                        sx={{
                          scrollbarWidth: "none",
                          "&::-webkit-scrollbar": { display: "none" },
                        }}
                        onScroll={handleScroll}
                        p={4}
                        bg="custom.theme.light.100"
                        minH="400px"
                        backgroundImage={
                          colorMode === "light"
                            ? "url('/images/common/paperFFF.webp')"
                            : "url('/images/common/paper181d26.png')"
                        }
                        backgroundRepeat="repeat"
                        backgroundSize="cover"
                        backgroundPosition="center"
                        onWheel={(e) => {
                          if (e.deltaY !== 0) {
                            e.currentTarget.scrollLeft += e.deltaY;
                            e.preventDefault();
                          }
                        }}
                      >
                        {(placedListRef.current = [])}
                        {displayCategories
                          .flatMap((category) => [
                            // カテゴリー名
                            {
                              type: "category" as const,
                              key: `cat-${category}`,
                              content: category,
                            },
                            // そのカテゴリーの商品
                            ...menuItems
                              .filter((item) => item.category === category)
                              .map((item) => ({
                                type: "item" as const,
                                key: `item-${item.id}`,
                                content: item,
                              })),
                          ])

                          .map((col) => {
                            if (col.type === "category") {
                              const rightStr = rightPositions.find(
                                (pos) => pos.key === col.key
                              )
                                ? `${
                                    rightPositions.find(
                                      (pos) => pos.key === col.key
                                    )!.right
                                  }px`
                                : "100px";
                              const currentRight = parseInt(
                                rightStr.replace("px", "")
                              );
                              const w =
                                col.content === "アルコール"
                                  ? 200
                                  : col.content === "刺身"
                                  ? 180
                                  : col.content === "やさい"
                                  ? 160
                                  : col.content === "デザート"
                                  ? 60
                                  : 150;
                              const src =
                                col.content === "アルコール"
                                  ? "/images/illust/obj/ochoshi.svg"
                                  : col.content === "刺身"
                                  ? "/images/illust/obj/osashimi.svg"
                                  : col.content === "やさい"
                                  ? "/images/illust/obj/yasai1.svg"
                                  : col.content === "デザート"
                                  ? "/images/illust/obj/dessert.svg"
                                  : "";

                              const categoryOpacity =
                                col.content === "アルコール"
                                  ? "0.8"
                                  : col.content === "刺身"
                                  ? "0.7"
                                  : col.content === "やさい"
                                  ? "0.5"
                                  : col.content === "デザート"
                                  ? "0.5"
                                  : "1";

                              const {
                                categoryBottom,
                                categoryScale,
                                categoryRotation,
                              } = getCustomCategoryRandoms(col.content);

                              let overlaps = false;
                              if (prevRight !== null && prevWidth !== null) {
                                const leftB = prevRight + prevWidth;
                                overlaps = !(
                                  leftB < currentRight && src !== ""
                                );
                              }
                              // 前回値を更新
                              if (!overlaps) {
                                prevRight = currentRight;
                                prevWidth = w;
                              }
                              return (
                                <>
                                  <Box
                                    key={col.key}
                                    ref={(el) => {
                                      colRefs.current[col.key] = el;
                                    }}
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    mx={2}
                                    height="100%"
                                  >
                                    <Text
                                      fontFamily="'Yuji Syuku', serif"
                                      fontWeight="800"
                                      fontSize="2xl"
                                      color={
                                        colorMode === "light"
                                          ? "custom.theme.light.850"
                                          : "custom.theme.dark.150"
                                      }
                                      sx={{ writingMode: "vertical-rl" }}
                                      textAlign="center"
                                    >
                                      {col.content}
                                    </Text>
                                  </Box>
                                  {!overlaps && (
                                    <Image
                                      position="absolute"
                                      // border="1px solid red"
                                      zIndex="10"
                                      bottom={`${categoryBottom}px`}
                                      right={rightStr}
                                      w={`${w}px`}
                                      src={src}
                                      style={{
                                        filter:
                                          colorMode === "light"
                                            ? "sepia(0.3) contrast(0.9)"
                                            : "invert(1)",
                                        transform: `scale(${categoryScale}) rotate(${categoryRotation}deg)`,
                                        opacity: categoryOpacity,
                                      }}
                                    />
                                  )}
                                </>
                              );
                            } else {
                              // contentはMenuItem
                              const item = col.content;
                              // ランダム値を生成
                              const { randomTop, randomHeight } = item.isSoldOut
                                ? getSoldOutRandom(item.id)
                                : { randomTop: "50%", randomHeight: "10px" };
                              return (
                                <Box
                                  key={col.key}
                                  ref={(el) => {
                                    colRefs.current[col.key] = el;
                                  }}
                                  fontFamily="'Yuji Syuku', serif"
                                  fontSize="20px"
                                  fontWeight="400"
                                  color={
                                    colorMode === "light"
                                      ? "custom.theme.light.900"
                                      : "custom.theme.dark.100"
                                  }
                                  sx={{
                                    writingMode: "vertical-rl",
                                    position: "relative",
                                    "&::after": item.isSoldOut
                                      ? {
                                          content: '""',
                                          position: "absolute",
                                          left: "50%",
                                          top: randomTop,
                                          width: "120%",
                                          height: randomHeight,
                                          background:
                                            "linear-gradient(120deg, transparent 10%, #d32f2f 50%, transparent 90%)",
                                          transform:
                                            "translate(-50%, -50%) rotate(-10deg)",
                                          borderRadius: "8px",
                                          opacity: 0.8,
                                          pointerEvents: "none",
                                          zIndex: 2,
                                        }
                                      : {},
                                  }}
                                  textAlign="center"
                                  mt={5}
                                  cursor={
                                    item.isSoldOut ? "default" : "pointer"
                                  }
                                  opacity={item.isSoldOut ? 0.8 : 1}
                                  onClick={() => addToCart(item, mode)}
                                  _hover={{
                                    transform: !item.isSoldOut && "scale(1.1)",
                                    transition: "all 0.2s ease-in-out",
                                  }}
                                >
                                  {item.name}
                                </Box>
                              );
                            }
                          })}
                      </Box>
                    </Box>
                  </Box>
                </SimpleGrid>
              )}
            </Box>

            <Box mt={mode === 0 || mode === 1 ? 3 : 0}>
              {cart.length > 0 && (
                <>
                  <Heading size="sm" mb={1}>
                    <Flex align="center" position="relative" w="100%" top="8px">
                      <Box
                        flex="1"
                        h="1px"
                        bg={
                          colorMode === "light"
                            ? "custom.theme.light.800"
                            : "custom.theme.dark.200"
                        }
                      />
                      <Text
                        px="4"
                        zIndex="1"
                        color={
                          colorMode === "light"
                            ? "custom.theme.light.900"
                            : "custom.theme.dark.200"
                        }
                        bg={
                          colorMode === "light"
                            ? "custom.theme.light.500"
                            : "custom.theme.dark.500"
                        }
                        fontWeight="bold"
                      >
                        注文内容
                      </Text>
                      <Box
                        flex="1"
                        h="1px"
                        bg={
                          colorMode === "light"
                            ? "custom.theme.light.800"
                            : "custom.theme.dark.200"
                        }
                      />
                    </Flex>
                  </Heading>
                  <VStack spacing={0} align="stretch">
                    {cart.map((cartItem) => (
                      <Box
                        key={cartItem.item.id}
                        p={0}
                        borderRadius="md"
                        fontFamily="Yomogi"
                        fontWeight="600"
                      >
                        <HStack justify="space-between">
                          <HStack spacing={2}>
                            {cartItem.item.imageUrl ? (
                              <Image
                                src={cartItem.item.imageUrl}
                                alt={cartItem.item.name}
                                boxSize="50px"
                                objectFit="cover"
                                borderRadius="md"
                              />
                            ) : (
                              <Center
                                w="50px"
                                h="50px"
                                fontSize="sm"
                                overflow="clip"
                                borderRadius="md"
                                bg="custom.theme.light.200"
                                textAlign="center"
                                lineHeight="1.1"
                              >
                                NO <br />
                                IMAGE
                              </Center>
                            )}
                            <Box>
                              <Text>{cartItem.item.name}</Text>
                              <Text>
                                {cartItem.quantity}個・{cartItem.item.price}円
                              </Text>
                            </Box>
                          </HStack>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => removeFromCart(cartItem.item.id)}
                          >
                            削除
                          </Button>
                        </HStack>
                        <Box
                          h="0.5px"
                          w="98%"
                          mx="auto"
                          my="5px"
                          bg={
                            colorMode === "light"
                              ? "custom.theme.light.800"
                              : "custom.theme.dark.200"
                          }
                        />
                      </Box>
                    ))}
                    <Box mt={1}>
                      <Center fontWeight={600}>{calculateTotal()}円</Center>
                      <Center>
                        <Button
                          mt={2}
                          color="custom.theme.light.100"
                          bg="custom.theme.light.850"
                          _hover={{
                            color: "custom.theme.light.200",
                            bg: "custom.theme.light.800",
                            transition: "all 0.2s",
                          }}
                          onClick={handleSubmitOrder}
                          isLoading={isSubmitting}
                          w="auto"
                        >
                          <Box data-roof-id="sakura">
                            <HStack>
                              <Box
                                as={FaAnglesDown}
                                fontSize="sm"
                                animation="moveUpDown 1s ease-in-out infinite"
                                sx={{
                                  "@keyframes moveUpDown": {
                                    "0%": { transform: "translateY(1px)" },
                                    "50%": { transform: "translateY(-1px)" }, // 上に10px移動
                                    "100%": { transform: "translateY(1px)" }, // 元の位置に戻る
                                  },
                                }}
                              />
                              <Text>注文を確定</Text>
                              <Box
                                as={FaAnglesDown}
                                fontSize="sm"
                                animation="moveUpDown 1s ease-in-out infinite"
                                sx={{
                                  "@keyframes moveUpDown": {
                                    "0%": { transform: "translateY(1px)" },
                                    "50%": { transform: "translateY(-1px)" }, // 上に10px移動
                                    "100%": { transform: "translateY(1px)" }, // 元の位置に戻る
                                  },
                                }}
                              />
                            </HStack>
                          </Box>
                        </Button>
                      </Center>
                    </Box>
                  </VStack>
                </>
              )}
              {renderOrderHistory()}
            </Box>
          </Grid>
        </Box>
      </Content>
      <Box data-roof-id="sakura" />
    </>
  );
}
