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
import "@fontsource/yomogi";
import * as d3 from "d3";
import React from "react";
import cloud from "d3-cloud";
import { StarIcon } from "@chakra-ui/icons";
import { FaStar } from "react-icons/fa";

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
}

const CATEGORY_CONFIG = {
  おつまみ: { color: "#f56464", order: 1 },
  刺身: { color: "#4199e0", order: 2 },
  焼き物: { color: "#ed8937", order: 3 },
  揚げ物: { color: "#edca4c", order: 4 },
  ご飯もの: { color: "#777", order: 5 },
  サラダ: { color: "#49ba78", order: 6 },
  アルコール: { color: "#a07aeb", order: 7 },
  ドリンク: { color: "#2a6bb0", order: 8 },
} as const;

const searchCategoryColor = (searchTerm: string): string[] => {
  return Object.entries(CATEGORY_CONFIG)
    .filter(([category]) => category.includes(searchTerm))
    .map(([, config]) => config.color);
};

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

const categoryColors: { [key: string]: string } = {
  おつまみ: "#f56464",
  刺身: "#4199e0",
  焼き物: "#ed8937",
  揚げ物: "#edca4c",
  ご飯もの: "#777",
  サラダ: "#49ba78",
  アルコール: "#a07aeb",
  ドリンク: "#2a6bb0",
};

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
    xl: 6,
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

  useEffect(() => {
    fetchMenuItems();
  }, []);
  useEffect(() => {
    handleReposition();
  }, [menuItems]);

  useEffect(() => {
    if (svgRef.current) {
      drawWordCloud(wordCloudData);
    }
  }, [wordCloudData]);

  // カテゴリ変更時の処理
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // カテゴリ変更時は再配置しない
  };

  // カートにアイテムを追加したときの処理
  const addToCart = useCallback((item: MenuItem) => {
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
          console.log(`カテゴリ: ${item.category}, 色: ${nameColor}`);

          return {
            ...item,
            imageUrl: imageUrl,
            imageUrlSub: imageUrlSub,
            nameColor: nameColor,
          };
        }) || [];
    console.log("取得したメニューアイテム:", itemsWithCorrectImageUrl); // 取得したデータをログに出力
    setMenuItems(itemsWithCorrectImageUrl);
    console.log("menuItemsの状態:", itemsWithCorrectImageUrl); // 状態を確認
  };

  const categories = [
    "すべて",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  const filteredItems =
    selectedCategory === "すべて"
      ? menuItems.map((item) => ({
          ...item,
          imageUrl: imageCache[item.imageUrl] || item.imageUrl, // キャッシュから取得
        }))
      : menuItems
          .filter((item) => item.category === selectedCategory)
          .map((item) => ({
            ...item,
            imageUrl: imageCache[item.imageUrl] || item.imageUrl, // キャッシュから取得
          }));

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

  // ワードクラウドのオプションをメモ化
  const wordCloudOptions = useMemo(
    () => ({
      rotations: 1,
      rotationAngles: [0],
      fontSizes: [24, 120] as [number, number], // 最小サイズを24に調整
      fontFamily: "sans-serif",
      fontWeight: "900",
      padding: 2,
      enableTooltip: false,
      deterministic: true,
      transitionDuration: 2000,
      scale: "sqrt",
      spiral: "archimedean",
    }),
    []
  );

  // wordCloudへのマウスオーバー
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [hoveredWord, setHoveredWord] = useState<{
    text: string;
    value: number;
  } | null>(null); // 新しい状態を追加

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isHover) {
        setMousePosition({ x: event.clientX, y: event.clientY });
      }
      setTooltipData((prev) => {
        if (prev) {
          return {
            ...prev,
            mouseX: event.clientX,
            mouseY: event.clientY,
          };
        }
        return prev; // prevがnullの場合はそのまま返す
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHover, hoveredWord]);

  useEffect(() => {
    console.log("isHover state changed:", isHover);
  }, [isHover]);

  const handleWordMouseOver = (
    word: { text: string; value: number },
    event: React.MouseEvent<Element>
  ) => {
    console.log("Mouse over event triggered", word);
    if (!word) {
      console.error("Word data is undefined.");
      return;
    }

    setIsHover(true);
    setHoveredWord(word);
    const value = word.value ?? 0;
    setTooltipData({
      text: word.text,
      value: value,
      mouseX: mousePosition.x,
      mouseY: mousePosition.y,
    });
    console.log("tooltipdata::::", tooltipData);
  };

  const handleWordMouseOut = () => {
    setIsHover(false);
    setTooltipData((prev) => {
      if (prev) {
        return {
          ...prev,
          mouseX: mousePosition.x, // ここでmousePositionをそのまま使用
          mouseY: mousePosition.y, // ここでmousePositionをそのまま使用
        };
      }
      return prev; // prevがnullの場合はそのまま返す
    });
  };

  const findRelatedItem = (text: string) => {
    return menuItems.find((item) => item.name === text);
  };

  // 画面サイズがmdを超える場合にtrueを返す
  const isMdOrLarger = useBreakpointValue({ base: false, md: true });
  const isLgOrLarger = useBreakpointValue({ base: false, lg: true });

  const drawWordCloud = useCallback(
    (words: { text: string; value: number; category: string }[]) => {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const layout = cloud()
        .size([1200, 600])
        .words(
          words
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
        const centerX = 600;
        const centerY = 300;

        const group = svg
          .append("g")
          .attr("transform", `translate(${centerX},${centerY})`);

        words.forEach((d, i) => {
          const wordGroup = group.append("g");

          const text = wordGroup
            .append("text")
            .style("font-size", "1px")
            .style("font-weight", "900")
            .style("fill", CATEGORY_CONFIG[d.category]?.color || "#000")
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
    []
  );

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
            <HStack justify="center" align="center" spacing={3}>
              <AnimationImage
                src="/images/illust/obj/oden2.gif"
                position="static"
                animation="sway 3s ease-in-out infinite"
                transformOrigin="top center" // ← ここが吊るしポイント！
                height="60px"
                sealSize="10"
              />
              <AnimationImage
                src="/images/illust/obj/oden2.gif"
                position="static"
                animation="sway 3s ease-in-out infinite"
                transformOrigin="top center" // ← ここが吊るしポイント！
                height="60px"
                sealSize="0"
              />
              <Text>居酒屋ぼん</Text>
              <Image
                src="/images/illust/obj/oden2.gif"
                height="60px"
                alt="おでん"
              />
              <AnimationImage
                src="/images/illust/obj/oden2.gif"
                position="static"
                animation="sway 3s ease-in-out infinite"
                transformOrigin="top center" // ← ここが吊るしポイント！
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
                  mt={9}
                >
                  <Box data-roof-id="sakura">
                    <FilteredImage />
                  </Box>
                </Box>
              )}
            </VStack>
            <Box px={2}>
              <Tabs variant="soft-rounded">
                <TabList overflowX="auto" pb={1} ml={4}>
                  {categories.map((category) => (
                    <Tab
                      p="2"
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      bg={
                        selectedCategory === category
                          ? "custom.theme.light.400"
                          : undefined
                      }
                      color={
                        selectedCategory === category ? "white" : undefined
                      }
                    >
                      <Box textAlign="center" lineHeight={1.1}>
                        {category}
                        <Box
                          width="100%"
                          height="3px"
                          bg={searchCategoryColor(category)[0]}
                          mt={0}
                        />
                      </Box>
                    </Tab>
                  ))}
                </TabList>
              </Tabs>
              <SimpleGrid
                columns={gridColumns}
                spacing={4}
                fontFamily="Yomogi"
                fontWeight="600"
              >
                {filteredItems.map((item) => (
                  <Tooltip
                    label={
                      item.imageUrlSub && (
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
                      onClick={() => addToCart(item)}
                      p={0}
                      m={0}
                      h="auto"
                      bg={colorMode === "light" ? "transparent" : "gray.700"}
                      _hover={{
                        transform: "scale(1.05)",
                        transition: "transform 0.2s ease",
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
                      >
                        <AnimationImage
                          src={item.imageUrl}
                          height="100%"
                          width="100%"
                          objectFit="cover"
                          position="static"
                        />
                        {item.recommendation_level >= 4 && (
                          <Box
                            position="absolute"
                            top="0"
                            left="0"
                            transform="rotate(-40deg) translate(-46%, 100%)"
                            transformOrigin="top left"
                            bg="red.500"
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
                      </Box>
                      <Box
                        bg={searchCategoryColor(item.category)[0]}
                        h="3px"
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
                      <Text fontSize="xs" color="gray.500">
                        提供目安: {item.estimated_time}分
                      </Text>
                    </Button>
                  </Tooltip>
                ))}
              </SimpleGrid>
              {/* ダイナミックタイポグラフィ風のメニュー表示を追加 */}
              <Box mt={8}>
                <HStack justify="center" mb={4}>
                  <Heading size="md">WordCloud:menu</Heading>
                  <Button
                    onClick={handleReposition}
                    colorScheme="blue"
                    size="sm"
                  >
                    再配置
                  </Button>
                </HStack>
                <Box
                  display="flex"
                  justifyContent="center"
                  border="1px solid #333"
                >
                  <svg
                    ref={svgRef}
                    width="1200"
                    height="600"
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
                            <Text fontWeight={600}>{tooltipData.text}</Text>
                            <Text fontSize="sm" fontWeight={400}>
                              {relatedItem.price}円
                            </Text>
                            <Text fontSize="sm" fontWeight={600} color="gray">
                              提供目安: {relatedItem.estimated_time}分
                            </Text>

                            <Text fontSize="sm">{tooltipData.value}</Text>
                          </Flex>
                        );
                      }
                      return null;
                    })()}
                  </Box>
                )}
              </Box>
            </Box>

            <Box mt={3}>
              {cart.length > 0 && (
                <>
                  <Heading size="sm" mb={1}>
                    <Center>注文内容</Center>
                  </Heading>
                  <VStack spacing={0} align="stretch">
                    {cart.map((cartItem) => (
                      <Box
                        key={cartItem.item.id}
                        p={0}
                        // bg={colorMode === "light" ? "white" : "gray.700"}
                        borderRadius="md"
                        fontFamily="Yomogi"
                        fontWeight="600"
                      >
                        <HStack justify="space-between">
                          <HStack spacing={2}>
                            <Image
                              src={cartItem.item.imageUrl}
                              alt={cartItem.item.name}
                              boxSize="50px"
                              objectFit="cover"
                              borderRadius="md"
                              fallbackSrc="https://placehold.jp/150x150.png"
                            />
                            <Box>
                              <Text>{cartItem.item.name}</Text>
                              <Text>
                                {cartItem.quantity}個 × {cartItem.item.price}円
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
                        <Divider
                          border="1px solid"
                          borderColor="custom.theme.light.800"
                          m="5px"
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
                          <Box data-roof-id="sakura">注文を確定</Box>
                        </Button>
                      </Center>
                    </Box>
                  </VStack>
                </>
              )}
            </Box>
          </Grid>
        </Box>
      </Content>
      <Box data-roof-id="sakura" />
    </>
  );
}
