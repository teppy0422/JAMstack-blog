"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  useColorMode,
  Input,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  useToast,
  Image,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Checkbox,
  Avatar,
  Flex,
  Center,
  Tab,
  Tabs,
  TabList,
} from "@chakra-ui/react";
import { supabase } from "../../utils/supabase/client";
import { VscAccount } from "react-icons/vsc";
import imageCompression from "browser-image-compression";
import { useUserContext } from "../../context/useUserContext";
import Content from "../../components/content";
import { FaAnglesDown } from "react-icons/fa6";
import {
  CATEGORY_CONFIG,
  searchCategoryBg,
  searchCategoryColor,
} from "../utils/categoryConfig";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  imageUrlSub: string;
  ingredients: { name: string; location: string }[];
  is_visible: boolean;
  recommendation_level: number;
  estimated_time: number;
  recipe: string;
  isSoldOut: boolean;
}

interface Order {
  id: number;
  total: number;
  created_at: string;
  status: "pending" | "completed";
  user_id: string;
  order_items: {
    id: number;
    menu_item_id: number;
    quantity: number;
    price: number;
    status: "pending" | "completed";
    menu_item: {
      id: number;
      name: string;
      image_url: string;
    };
  }[];
}

export default function AdminPage() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputSubRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isIngredientsModalOpen,
    onOpen: onIngredientsModalOpen,
    onClose: onIngredientsModalClose,
  } = useDisclosure();
  const {
    isOpen: isRecipeModalOpen,
    onOpen: onRecipeModalOpen,
    onClose: onRecipeModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteConfirmModalOpen,
    onOpen: onDeleteConfirmModalOpen,
    onClose: onDeleteConfirmModalClose,
  } = useDisclosure();
  const {
    isOpen: isCompleteConfirmModalOpen,
    onOpen: onCompleteConfirmModalOpen,
    onClose: onCompleteConfirmModalClose,
  } = useDisclosure();
  const {
    isOpen: isLocationModalOpen,
    onOpen: onLocationModalOpen,
    onClose: onLocationModalClose,
  } = useDisclosure();
  const {
    isOpen: isApplyConfirmModalOpen,
    onOpen: onApplyConfirmModalOpen,
    onClose: onApplyConfirmModalClose,
  } = useDisclosure();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    price: undefined,
    category: "",
    imageUrl: "",
    imageUrlSub: "",
    ingredients: [],
    is_visible: true,
    recommendation_level: 0,
    estimated_time: 0,
    recipe: "",
    isSoldOut: false,
  });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewImageSub, setPreviewImageSub] = useState<string>("");
  const [ingredientInputs, setIngredientInputs] = useState<string[]>([""]);
  const [ingredientLocations, setIngredientLocations] = useState<{
    [key: string]: string;
  }>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const {
    currentUserId,
    currentUserPictureUrl,
    currentUserEmail,
    currentUserCreatedAt,
    getUserById,
    isLoading,
  } = useUserContext();
  const userData = currentUserId ? getUserById(currentUserId) : null;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<string>("");
  const [itemToDelete, setItemToDelete] = useState<{ id: number } | null>(null);
  const [itemToComplete, setItemToComplete] = useState<{
    id: number;
    menuItemId: number;
  } | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<string>("");
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [imageCache, setImageCache] = useState<{ [key: string]: string }>({});
  const [preloadedImages, setPreloadedImages] = useState<{
    [key: string]: HTMLImageElement;
  }>({});
  const [showVisibleOnly, setShowVisibleOnly] = useState(false);

  // 画像のプリロード関数
  const preloadImage = useCallback(
    (url: string) => {
      if (!preloadedImages[url]) {
        const img = document.createElement("img");
        img.src = url;
        img.crossOrigin = "anonymous";
        setPreloadedImages((prev) => ({ ...prev, [url]: img }));
      }
    },
    [preloadedImages]
  );

  const categories = [
    "すべて",
    ...Object.entries(CATEGORY_CONFIG)
      .sort((a, b) => a[1].order - b[1].order)
      .map(([name]) => name),
  ];
  const locations = [
    "酒類",
    "パン類",
    "乳製品",
    "精肉",
    "調味料",
    "鮮魚",
    "青果",
    "お米",
    "KALDI",
    "リカオー",
    "その他",
  ];

  const locationTextColors = {
    酒類: "purple.600",
    パン類: "orange.600",
    乳製品: "blue.600",
    精肉: "red.600",
    調味料: "orange.600",
    鮮魚: "cyan.600",
    青果: "green.600",
    お米: "yellow.600",
    KALDI: "pink.600",
    リカオー: "pink.400",
    その他: "gray.600",
  };

  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  const filteredItems =
    selectedCategory === "すべて"
      ? menuItems
          .map((item) => ({
            ...item,
            imageUrl: imageCache[item.imageUrl] || item.imageUrl,
            imageUrlSub: imageCache[item.imageUrlSub] || item.imageUrlSub,
          }))
          .sort((a, b) => {
            const orderA = categories.indexOf(a.category);
            const orderB = categories.indexOf(b.category);
            return orderA - orderB;
          })
      : menuItems
          .filter((item) => item.category === selectedCategory)
          .map((item) => ({
            ...item,
            imageUrl: imageCache[item.imageUrl] || item.imageUrl,
            imageUrlSub: imageCache[item.imageUrlSub] || item.imageUrlSub,
          }))
          .sort((a, b) => {
            const orderA = categories.indexOf(a.category);
            const orderB = categories.indexOf(b.category);
            return orderA - orderB;
          });

  const adjustTextareaHeight = useCallback((element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, []);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [isOpen, newItem.recipe, adjustTextareaHeight]);

  useEffect(() => {
    fetchMenuItems();
    fetchOrders();
    const cleanup = setupRealtimeSubscription();
    return () => cleanup();
  }, []);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from("order_menu_items")
      .select("*, image_url_sub")
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

    // 画像URLをキャッシュし、プリロード
    const itemsWithCorrectImageUrl =
      data?.map((item) => {
        // 材料データの処理
        let parsedIngredients = [];
        try {
          parsedIngredients = item.ingredients.map((ing: string) => {
            if (typeof ing === "string") {
              return JSON.parse(ing);
            }
            return ing;
          });
        } catch (e) {
          console.error("材料データのパースに失敗:", e);
          parsedIngredients = [];
        }

        const imageUrl = item.image_url;
        const imageUrlSub = item.image_url_sub;
        if (imageUrl && !imageCache[imageUrl]) {
          setImageCache((prev) => ({ ...prev, [imageUrl]: imageUrl }));
          preloadImage(imageUrl);
        }
        if (imageUrlSub && !imageCache[imageUrlSub]) {
          setImageCache((prev) => ({ ...prev, [imageUrlSub]: imageUrlSub }));
          preloadImage(imageUrlSub);
        }

        return {
          ...item,
          imageUrl: preloadedImages[imageUrl]?.src || imageUrl,
          imageUrlSub: preloadedImages[imageUrlSub]?.src || imageUrlSub,
          ingredients: parsedIngredients,
        };
      }) || [];

    setMenuItems(itemsWithCorrectImageUrl);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          menu_item_id,
          quantity,
          price,
          status,
          menu_item:menu_item_id (
            id,
            name,
            image_url
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "エラー",
        description: "注文の取得に失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setOrders(data || []);
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel("orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            // 新しい注文が追加された時に通知音を再生
            if (audioRef.current) {
              audioRef.current.play().catch((error) => {
                console.error("Error playing sound:", error);
              });
            }
            // トースト通知を表示
            toast({
              title: "新しい注文",
              description: "新しい注文が入りました",
              status: "info",
              duration: 5000,
              isClosable: true,
            });
          }
          await fetchOrders();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_items",
        },
        async (payload) => {
          await fetchOrders();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleOrderStatusChange = async (
    itemId: number,
    newStatus: "pending" | "completed"
  ) => {
    try {
      // ordersテーブルの更新
      const { error: orderError } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", itemId);

      if (orderError) throw orderError;

      // order_itemsテーブルの更新
      const { error: itemsError } = await supabase
        .from("order_items")
        .update({
          status: newStatus,
          completed_at: new Date(), // ← 現在の日時をセット
        })

        .eq("id", itemId);

      if (itemsError) throw itemsError;

      toast({
        title: "成功",
        description: "注文ステータスを更新しました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      await fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "エラー",
        description: "注文ステータスの更新に失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isSubImage: boolean
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // プレビュー表示
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isSubImage) {
        setPreviewImageSub(reader.result as string);
      } else {
        setPreviewImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);

    try {
      // 画像をWebP形式に変換
      const options = {
        maxSizeMB: 0.7,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: "image/webp",
        initialQuality: 0.7,
        alwaysKeepResolution: true,
      };

      const compressedFile = await imageCompression(file, options);
      console.log("Original size:", file.size / 1024 / 1024, "MB");
      console.log("Compressed size:", compressedFile.size / 1024 / 1024, "MB");

      // ファイル名を生成（タイムスタンプ + .webp）
      const fileName = `${Date.now()}.webp`;
      const filePath = `${fileName}`;

      // Supabase Storageにアップロード
      const { error: uploadError } = await supabase.storage
        .from("menu-image")
        .upload(filePath, compressedFile);

      if (uploadError) {
        toast({
          title: "エラー",
          description: "画像のアップロードに失敗しました",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // アップロードした画像のURLを取得
      const {
        data: { publicUrl },
      } = supabase.storage.from("menu-image").getPublicUrl(filePath);

      if (isSubImage) {
        setNewItem({ ...newItem, imageUrlSub: publicUrl });
      } else {
        setNewItem({ ...newItem, imageUrl: publicUrl });
      }
    } catch (error) {
      console.error("Error compressing image:", error);
      toast({
        title: "エラー",
        description: "画像の処理に失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newInputs = [...ingredientInputs];
    newInputs[index] = value;
    setIngredientInputs(newInputs);

    // 最後の入力欄が埋まったら新しい入力欄を追加
    if (index === newInputs.length - 1 && value.trim() !== "") {
      setIngredientInputs([...newInputs, ""]);
    }
  };

  const handleLocationSelect = (location: string) => {
    setIngredientLocations((prev) => ({
      ...prev,
      [selectedIngredient]: location,
    }));
    onLocationModalClose();
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 空文字列または数値のみを許可
    if (value === "" || /^\d*$/.test(value)) {
      setNewItem({
        ...newItem,
        price: value === "" ? undefined : Number(value),
      });
    }
  };

  const handleRecipeChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewItem((prev) => ({ ...prev, recipe: e.target.value }));
      adjustTextareaHeight(e.target);
    },
    [adjustTextareaHeight]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 価格が未入力の場合はエラー
    if (newItem.price === undefined) {
      toast({
        title: "エラー",
        description: "価格を入力してください",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // 空の材料を除外して保存
    const validIngredients = ingredientInputs
      .filter((ingredient) => ingredient.trim() !== "")
      .map((ingredient) => ({
        name: ingredient.trim(),
        location: ingredientLocations[ingredient] || "その他",
      }));

    try {
      if (editingItem) {
        // 更新前の画像URLを保存
        const oldImageUrl = editingItem.imageUrl;
        const oldImageUrlSub = editingItem.imageUrlSub;

        // 更新するデータを準備
        const updateData: any = {
          name: newItem.name,
          price: newItem.price,
          category: newItem.category,
          ingredients: validIngredients,
          is_visible: newItem.is_visible,
          recipe: newItem.recipe,
          recommendation_level: newItem.recommendation_level,
          estimated_time: newItem.estimated_time,
        };

        // 画像が変更された場合のみ更新
        if (newItem.imageUrl && newItem.imageUrl !== oldImageUrl) {
          updateData.image_url = newItem.imageUrl;
        }
        if (newItem.imageUrlSub && newItem.imageUrlSub !== oldImageUrlSub) {
          updateData.image_url_sub = newItem.imageUrlSub;
        }

        const { error } = await supabase
          .from("order_menu_items")
          .update(updateData)
          .eq("id", editingItem.id);

        if (error) {
          toast({
            title: "エラー",
            description: "メニューアイテムの更新に失敗しました",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        // 画像が変更された場合、古い画像を削除
        if (
          oldImageUrl &&
          newItem.imageUrl &&
          oldImageUrl !== newItem.imageUrl
        ) {
          const oldImagePath = oldImageUrl.split("/").pop();
          if (oldImagePath) {
            const { error: deleteError } = await supabase.storage
              .from("menu-image")
              .remove([oldImagePath.split("?")[0]]);

            if (deleteError) {
              console.error("Error deleting old image:", deleteError);
            }
          }
        }

        if (
          oldImageUrlSub &&
          newItem.imageUrlSub &&
          oldImageUrlSub !== newItem.imageUrlSub
        ) {
          const oldImageSubPath = oldImageUrlSub.split("/").pop();
          if (oldImageSubPath) {
            const { error: deleteError } = await supabase.storage
              .from("menu-image")
              .remove([oldImageSubPath.split("?")[0]]);

            if (deleteError) {
              console.error("Error deleting old sub image:", deleteError);
            }
          }
        }
      } else {
        const { error } = await supabase.from("order_menu_items").insert([
          {
            name: newItem.name,
            price: newItem.price,
            category: newItem.category,
            image_url: newItem.imageUrl,
            image_url_sub: newItem.imageUrlSub,
            ingredients: validIngredients,
            is_visible: newItem.is_visible,
            recipe: newItem.recipe,
            recommendation_level: newItem.recommendation_level,
            estimated_time: newItem.estimated_time,
          },
        ]);

        if (error) {
          toast({
            title: "エラー",
            description: "メニューアイテムの追加に失敗しました",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }

      toast({
        title: "成功",
        description: editingItem
          ? "メニューアイテムを更新しました"
          : "メニューアイテムを追加しました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // フォームをリセット
      setNewItem({
        name: "",
        price: undefined,
        category: "",
        imageUrl: "",
        imageUrlSub: "",
        ingredients: [],
        is_visible: true,
        recommendation_level: 0,
        estimated_time: 0,
        recipe: "",
        isSoldOut: false,
      });
      setPreviewImage("");
      setPreviewImageSub("");
      setEditingItem(null);
      setIngredientInputs([""]);
      onClose();

      // メニューアイテムを再取得
      fetchMenuItems();
    } catch (error) {
      console.error("Error in submit process:", error);
      toast({
        title: "エラー",
        description: "処理中にエラーが発生しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = async (item: MenuItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl,
      imageUrlSub: item.imageUrlSub,
      ingredients: item.ingredients,
      is_visible: item.is_visible,
      recommendation_level: item.recommendation_level,
      estimated_time: item.estimated_time,
      recipe: item.recipe,
      isSoldOut: item.isSoldOut,
    });
    setPreviewImage(item.imageUrl);
    setPreviewImageSub(item.imageUrlSub);
    setIngredientInputs([...item.ingredients.map((ing) => ing.name), ""]);
    setIngredientLocations(
      item.ingredients.reduce(
        (acc, ing) => ({
          ...acc,
          [ing.name]: ing.location,
        }),
        {}
      )
    );
    onOpen();
    // モーダルを開いた後にテキストエリアの高さを調整
    setTimeout(() => {
      if (textareaRef.current) {
        adjustTextareaHeight(textareaRef.current);
      }
    }, 0);
  };

  const handleDelete = async (id: number) => {
    // 削除するアイテムの画像URLを取得
    const itemToDelete = menuItems.find((item) => item.id === id);
    if (!itemToDelete) return;

    try {
      // 画像1のファイル名を取得
      const imagePath = itemToDelete.imageUrl?.split("/").pop();
      // 画像2のファイル名を取得（存在する場合のみ）
      const imageSubPath = itemToDelete.imageUrlSub?.split("/").pop();

      console.log("imageUrlSub:", itemToDelete.imageUrlSub); // デバッグ用ログ
      console.log("imageSubPath:", imageSubPath); // デバッグ用ログ

      // Supabase Storageから画像を削除
      const pathsToDelete: string[] = [];
      if (imagePath) {
        const path = imagePath.split("?")[0]; // クエリパラメータを除去
        pathsToDelete.push(path);
      }
      if (imageSubPath) {
        const path = imageSubPath.split("?")[0]; // クエリパラメータを除去
        pathsToDelete.push(path);
      }

      if (pathsToDelete.length > 0) {
        const { error: deleteImageError } = await supabase.storage
          .from("menu-image")
          .remove(pathsToDelete);

        if (deleteImageError) {
          console.error("Error deleting image:", deleteImageError);
          toast({
            title: "エラー",
            description: "画像の削除に失敗しました",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }

      // データベースからアイテムを削除
      const { error: deleteItemError } = await supabase
        .from("order_menu_items")
        .delete()
        .eq("id", id);

      if (deleteItemError) {
        toast({
          title: "エラー",
          description: "メニューアイテムの削除に失敗しました",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      toast({
        title: "成功",
        description: "メニューアイテムを削除しました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      fetchMenuItems();
    } catch (error) {
      console.error("Error in delete process:", error);
      toast({
        title: "エラー",
        description: "削除処理中にエラーが発生しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleVisibilityChange = async (id: number, isVisible: boolean) => {
    const { error } = await supabase
      .from("order_menu_items")
      .update({ is_visible: isVisible })
      .eq("id", id);

    if (error) {
      toast({
        title: "エラー",
        description: "表示設定の更新に失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, is_visible: isVisible } : item
      )
    );
  };

  const handleSoldOutChange = async (id: number, isSoldOut: boolean) => {
    const { error } = await supabase
      .from("order_menu_items")
      .update({ isSoldOut: isSoldOut })
      .eq("id", id);

    if (error) {
      toast({
        title: "エラー",
        description: "売り切れ状態の更新に失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isSoldOut: isSoldOut } : item
      )
    );
  };

  const handleDeleteOrderItem = async (orderId: number, itemId: number) => {
    try {
      // 注文アイテムを削除
      const { error: itemError } = await supabase
        .from("order_items")
        .delete()
        .eq("id", itemId);

      if (itemError) throw itemError;

      // 注文の合計金額を再計算
      const { data: remainingItems, error: remainingError } = await supabase
        .from("order_items")
        .select("price, quantity")
        .eq("order_id", orderId);

      if (remainingError) throw remainingError;

      const newTotal =
        remainingItems?.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ) || 0;

      // 注文の合計金額を更新
      const { error: updateError } = await supabase
        .from("orders")
        .update({ total: newTotal })
        .eq("id", orderId);

      if (updateError) throw updateError;

      // 注文にアイテムが残っていない場合は注文自体を削除
      if (remainingItems?.length === 0) {
        const { error: deleteOrderError } = await supabase
          .from("orders")
          .delete()
          .eq("id", orderId);

        if (deleteOrderError) throw deleteOrderError;
      }

      toast({
        title: "成功",
        description: "注文アイテムを削除しました",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      fetchOrders();
    } catch (error) {
      console.error("Error deleting order item:", error);
      toast({
        title: "エラー",
        description: "注文アイテムの削除に失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    await handleDelete(itemToDelete.id);
    onDeleteConfirmModalClose();
  };

  const handleCompleteConfirm = async (isSoldOut: boolean = false) => {
    if (!itemToComplete) return;

    try {
      // 注文アイテムを完了にする
      await handleOrderStatusChange(itemToComplete.id, "completed");

      // 売り切れにする場合
      if (isSoldOut) {
        const { error } = await supabase
          .from("order_menu_items")
          .update({ isSoldOut: true })
          .eq("id", itemToComplete.menuItemId);

        if (error) throw error;
      }

      onCompleteConfirmModalClose();
    } catch (error) {
      console.error("Error completing order:", error);
      toast({
        title: "エラー",
        description: "処理中にエラーが発生しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // LocalStorageからチェック状態を読み込む
  useEffect(() => {
    const savedItems = localStorage.getItem("shoppingList");
    if (savedItems) {
      setCheckedItems(JSON.parse(savedItems));
    }
  }, []);

  // チェック状態をLocalStorageに保存
  const saveToLocalStorage = (items: { [key: string]: boolean }) => {
    localStorage.setItem("shoppingList", JSON.stringify(items));
  };

  // チェック状態を切り替える
  const toggleItem = (ingredient: string) => {
    const newCheckedItems = {
      ...checkedItems,
      [ingredient]: !checkedItems[ingredient],
    };
    setCheckedItems(newCheckedItems);
    saveToLocalStorage(newCheckedItems);
  };

  // チェック状態をリセット
  const resetCheckedItems = () => {
    setCheckedItems({});
    localStorage.removeItem("shoppingList");
  };

  // 選択した材料で作れるメニューアイテムを表示/非表示にする
  const applySelectedIngredients = async () => {
    onApplyConfirmModalClose();
    // チェックされている材料を取得
    const selectedIngredients = Object.entries(checkedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([ingredient]) => ingredient);

    // 各メニューアイテムに対して
    for (const item of menuItems) {
      // 必要な材料を取得
      const requiredIngredients = item.ingredients.map((ing) => ing.name);

      // 選択した材料で作れるかチェック
      const canMake = requiredIngredients.every((ing) =>
        selectedIngredients.includes(ing)
      );

      // 表示状態を更新
      const { error } = await supabase
        .from("order_menu_items")
        .update({ is_visible: canMake })
        .eq("id", item.id);

      if (error) {
        console.error("メニューアイテムの更新に失敗:", error);
        continue;
      }

      // 売り切れ状態を解除
      const { error: soldOutError } = await supabase
        .from("order_menu_items")
        .update({ isSoldOut: false })
        .eq("id", item.id);

      if (soldOutError) {
        console.error("売り切れ状態の更新に失敗:", soldOutError);
      }
    }

    // メニューアイテムを再取得
    await fetchMenuItems();

    toast({
      title: "反映完了",
      description: "選択した材料で作れるメニューを表示しました",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Content isCustomHeader={true}>
      <Box p={{ base: "2", sm: "4" }}>
        <audio ref={audioRef} src="/sound/missed.mp3" preload="auto" />
        <Heading mb={6} textAlign="center">
          管理者ページ
        </Heading>

        <Box>
          <HStack spacing={4} mb={4}>
            <Button colorScheme="blue" onClick={onOpen}>
              アイテムを追加
            </Button>
            <Button colorScheme="green" onClick={onIngredientsModalOpen}>
              使用材料一覧
            </Button>
          </HStack>

          <Heading size="md" mb={4}>
            注文一覧
          </Heading>
          <VStack spacing={1} align="stretch" mb={8}>
            {orders.flatMap((order) => {
              const orderUserData = getUserById(order.user_id);
              return order.order_items.map((item) => (
                <Box
                  key={`${order.id}-${item.id}`}
                  p={1}
                  bg={colorMode === "light" ? "white" : "gray.700"}
                  borderRadius="md"
                >
                  <VStack align="stretch" spacing={1}>
                    <HStack spacing={2} justify="space-between">
                      <Image
                        src={item.menu_item.image_url}
                        alt={item.menu_item.name}
                        boxSize="50px"
                        minW="50px"
                        objectFit="cover"
                        borderRadius="md"
                        fallbackSrc="https://placehold.jp/150x150.png"
                      />
                      <Box textAlign="left" width="100%">
                        <Text fontWeight="bold">{item.menu_item.name}</Text>
                        <Text>{item.quantity}個</Text>
                      </Box>
                      <VStack align="flex-end" gap="1">
                        <Button
                          size="sm"
                          colorScheme={
                            item.status === "pending" ? "green" : "gray"
                          }
                          onClick={() => {
                            setItemToComplete({
                              id: item.id,
                              menuItemId: item.menu_item_id,
                            });
                            onCompleteConfirmModalOpen();
                          }}
                          isDisabled={item.status === "completed"}
                        >
                          完了
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() =>
                            handleDeleteOrderItem(order.id, item.id)
                          }
                        >
                          削除
                        </Button>
                      </VStack>
                    </HStack>
                    <HStack>
                      {/* <Text fontWeight="bold">注文ID: {order.id}</Text>
                        <Text fontWeight="bold">アイテムID: {item.id}</Text> */}
                      <Text>
                        {new Date(order.created_at).toLocaleString("ja-JP", {
                          // month: "numeric",
                          // day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          // second: "2-digit",
                        })}
                      </Text>
                      <Avatar
                        src={orderUserData?.picture_url || undefined}
                        size="xs"
                      />
                      <Button
                        size="xs"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => {
                          const menuItem = menuItems.find(
                            (m) => m.id === item.menu_item_id
                          );
                          if (menuItem) {
                            setSelectedRecipe(menuItem.recipe);
                            onRecipeModalOpen();
                          }
                        }}
                        isDisabled={
                          !menuItems.find((m) => m.id === item.menu_item_id)
                            ?.recipe
                        }
                      >
                        レシピ
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              ));
            })}
          </VStack>

          <Heading size="md" mb={4}>
            menu
          </Heading>

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
                // alignItems="center"
                position="relative"
                sx={{
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {categories.map((category) => {
                  // カテゴリごとのアイテム数を計算
                  const count =
                    category === "すべて"
                      ? menuItems.length
                      : menuItems.filter((item) => item.category === category)
                          .length;
                  return (
                    <Tab
                      p="1"
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      userSelect="none"
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                      alignItems="center"
                      _selected={{
                        bg: "transparent",
                      }}
                      _focus={{
                        boxShadow: "none",
                        bg: "transparent",
                      }}
                      sx={{
                        WebkitTapHighlightColor: "transparent",
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
                            selectedCategory === category ? "103%" : "3px"
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
                          transition="all 0.3s ease-in-out"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            writingMode: {
                              base: "vertical-rl",
                              md: "horizontal-tb",
                            },
                            whiteSpace: "nowrap",
                          }}
                          alignItems="center"
                        >
                          <Box as="span" display="inline">
                            {category}
                          </Box>
                          <Box
                            as="span"
                            color={
                              selectedCategory === category
                                ? searchCategoryColor(category)[0]
                                : colorMode === "light"
                                ? "custom.theme.light.850"
                                : "custom.theme.light.400"
                            }
                            sx={{
                              writingMode: "horizontal-tb",
                              display: "inline",
                              fontSize: "0.7em",
                            }}
                          >
                            ({count})
                          </Box>
                        </Box>
                      </Box>
                    </Tab>
                  );
                })}
              </TabList>
            </Flex>
          </Tabs>

          <HStack mb={2} _selected={{ bg: "transparent" }} bg="transparent">
            <Checkbox
              borderColor="custom.theme.light.800"
              isChecked={showVisibleOnly}
              onChange={(e) => setShowVisibleOnly(e.target.checked)}
            >
              表示がオンのアイテムのみ表示
            </Checkbox>
          </HStack>

          <VStack spacing={2} align="stretch">
            {(showVisibleOnly
              ? filteredItems.filter((item) => item.is_visible)
              : filteredItems
            )
              .sort((a, b) => {
                const orderA = categories.indexOf(a.category);
                const orderB = categories.indexOf(b.category);
                return orderA - orderB;
              })
              .map((item) => (
                <VStack
                  key={item.id}
                  position="relative"
                  align="stretch"
                  spacing={0.5}
                  bg={colorMode === "light" ? "white" : "gray.700"}
                  p={2}
                  borderRadius="md"
                  overflow="hidden"
                >
                  <Box
                    position="absolute"
                    h="100%"
                    w="4px"
                    top="0"
                    left="0"
                    bg={searchCategoryBg(item.category)[0]}
                  />
                  <HStack justify="space-between">
                    <Text fontWeight="600">{item.name}</Text>
                    <Text>おすすめ度: {item.recommendation_level}</Text>
                  </HStack>
                  <HStack
                    key={item.id}
                    borderRadius="md"
                    justify="space-between"
                  >
                    <HStack spacing={4} flex={1}>
                      <Image
                        src={
                          preloadedImages[item.imageUrl]?.src || item.imageUrl
                        }
                        alt={item.name}
                        boxSize="100px"
                        objectFit="cover"
                        mb={2}
                        fallbackSrc="https://placehold.jp/150x150.png"
                      />
                      <Box>
                        {/* <Text>価格: {item.price}円</Text> */}
                        <Text>カテゴリ: {item.category}</Text>
                        <Box>
                          材料:
                          {item.ingredients
                            .slice() // 元の順序を壊さないようコピー
                            .sort((a, b) => {
                              const orderA = locations.indexOf(a.location);
                              const orderB = locations.indexOf(b.location);
                              return orderA - orderB;
                            })
                            .map((ing, index) => (
                              <Box
                                as="span"
                                key={index}
                                position="relative"
                                fontWeight="bold"
                                mr="6px"
                                borderBottom="2px solid"
                                borderColor={locationTextColors[ing.location]}
                              >
                                {ing.name}
                              </Box>
                            ))}
                        </Box>
                        <Button
                          size="xs"
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => {
                            const menuItem = menuItems.find(
                              (m) => m.id === item.id
                            );
                            if (menuItem) {
                              setSelectedRecipe(menuItem.recipe);
                              onRecipeModalOpen();
                            }
                          }}
                          isDisabled={
                            !menuItems.find((m) => m.id === item.id)?.recipe
                          }
                        >
                          レシピ
                        </Button>
                      </Box>
                    </HStack>
                    <VStack align="flex-end">
                      <Checkbox
                        isChecked={item.is_visible}
                        onChange={(e) =>
                          handleVisibilityChange(item.id, e.target.checked)
                        }
                      >
                        表示
                      </Checkbox>
                      <Checkbox
                        isChecked={item.isSoldOut}
                        onChange={(e) =>
                          handleSoldOutChange(item.id, e.target.checked)
                        }
                        colorScheme="red"
                      >
                        売切
                      </Checkbox>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleEdit(item)}
                      >
                        編集
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => {
                          setItemToDelete({ id: item.id });
                          onDeleteConfirmModalOpen();
                        }}
                      >
                        削除
                      </Button>
                    </VStack>
                  </HStack>
                </VStack>
              ))}
          </VStack>

          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                メニューアイテムの{editingItem ? "編集" : "追加"}
              </ModalHeader>
              <ModalCloseButton />
              <form onSubmit={handleSubmit}>
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>商品名</FormLabel>
                      <Input
                        value={newItem.name}
                        onChange={(e) =>
                          setNewItem({ ...newItem, name: e.target.value })
                        }
                        required
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>価格</FormLabel>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={newItem.price === undefined ? "" : newItem.price}
                        onChange={handlePriceChange}
                        placeholder="例: 1000"
                        required
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>カテゴリ</FormLabel>
                      <Select
                        value={newItem.category}
                        onChange={(e) =>
                          setNewItem({ ...newItem, category: e.target.value })
                        }
                        required
                      >
                        <option value="">選択してください</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>画像1</FormLabel>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, false)}
                        ref={fileInputRef}
                        display="none"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        colorScheme="blue"
                        variant="outline"
                        w="full"
                      >
                        画像1を選択
                      </Button>
                      {previewImage && (
                        <Box mt={2}>
                          <Image
                            src={previewImage}
                            alt="プレビュー"
                            maxH="200px"
                            objectFit="contain"
                          />
                        </Box>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel>画像2</FormLabel>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        ref={fileInputSubRef}
                        display="none"
                      />
                      <Button
                        onClick={() => fileInputSubRef.current?.click()}
                        colorScheme="blue"
                        variant="outline"
                        w="full"
                      >
                        画像2を選択
                      </Button>
                      {previewImageSub && (
                        <Box mt={2}>
                          <Image
                            src={previewImageSub}
                            alt="プレビュー2"
                            maxH="200px"
                            objectFit="contain"
                          />
                        </Box>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel>材料</FormLabel>
                      <VStack spacing={2} align="stretch">
                        {ingredientInputs.map((ingredient, index) => (
                          <HStack key={index} spacing={2}>
                            <Input
                              value={ingredient}
                              onChange={(e) =>
                                handleIngredientChange(index, e.target.value)
                              }
                              placeholder="材料を入力"
                              mb={2}
                            />
                            {ingredient && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedIngredient(ingredient);
                                  onLocationModalOpen();
                                }}
                              >
                                {ingredientLocations[ingredient] ||
                                  "売り場を選択"}
                              </Button>
                            )}
                          </HStack>
                        ))}
                      </VStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>提供目安時間（分）</FormLabel>
                      <Input
                        type="number"
                        value={newItem.estimated_time}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            estimated_time: Number(e.target.value),
                          })
                        }
                        required
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>作り方</FormLabel>
                      <Textarea
                        ref={textareaRef}
                        value={newItem.recipe}
                        onChange={handleRecipeChange}
                        placeholder="レシピを入力"
                        mb={2}
                        resize="none"
                        _focus={{
                          borderColor: "custom.theme.light.850",
                          borderWidth: "1px",
                          boxShadow: "none",
                        }}
                        sx={{
                          height: "auto",
                          maxHeight: "none",
                          overflow: "hidden",
                        }}
                      />
                    </FormControl>

                    <FormControl>
                      <Checkbox
                        isChecked={newItem.is_visible}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            is_visible: e.target.checked,
                          })
                        }
                      >
                        注文ページで表示
                      </Checkbox>
                    </FormControl>

                    <FormControl>
                      <FormLabel>おすすめ度 (0-5)</FormLabel>
                      <Select
                        value={newItem.recommendation_level}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            recommendation_level: Number(e.target.value),
                          })
                        }
                      >
                        {[0, 1, 2, 3, 4, 4.5, 5].map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} type="submit">
                    {editingItem ? "更新" : "追加"}
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    キャンセル
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={isIngredientsModalOpen}
            onClose={onIngredientsModalClose}
            size="md"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>使用材料一覧</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack align="stretch" spacing={4}>
                  {locations.map((location) => {
                    // locationごとに材料名と使われているメニュー名リストを作成
                    const ingredientMap: { [ingredient: string]: Set<string> } =
                      {};

                    menuItems
                      .filter((item) => item.is_visible)
                      .forEach((item) => {
                        item.ingredients
                          .filter((ing) => ing.location === location)
                          .forEach((ing) => {
                            if (!ingredientMap[ing.name]) {
                              ingredientMap[ing.name] = new Set();
                            }
                            ingredientMap[ing.name].add(item.name);
                          });
                      });

                    const locationIngredients = Object.entries(ingredientMap)
                      .map(([name, menuSet]) => ({
                        name,
                        menuNames: Array.from(menuSet),
                      }))
                      .sort((a, b) => a.name.localeCompare(b.name));

                    if (locationIngredients.length === 0) return null;

                    return (
                      <Box key={location}>
                        <Flex justify="center" mb={4}>
                          <Box
                            position="relative"
                            fontWeight="bold"
                            color={locationTextColors[location]}
                            p={0}
                            borderRadius="md"
                          >
                            {location}
                            <Box
                              position="absolute"
                              height="3px"
                              width="100%"
                              bottom="0"
                              bg={locationTextColors[location]}
                            />
                          </Box>
                        </Flex>
                        <VStack align="stretch" spacing={2}>
                          {locationIngredients.map((ingredient) => (
                            <HStack
                              key={ingredient.name}
                              p={2}
                              userSelect="none"
                              border="1px solid"
                              borderColor="custom.theme.light.800"
                              bg={
                                checkedItems[ingredient.name]
                                  ? "gray.200"
                                  : "gray.600"
                              }
                              borderRadius="md"
                              cursor="pointer"
                              onClick={() => toggleItem(ingredient.name)}
                              textAlign="center"
                              alignItems="center" // 垂直中央寄せ
                              justifyContent="center" // 水平中央寄せ
                            >
                              <Checkbox
                                isChecked={
                                  checkedItems[ingredient.name] || false
                                }
                                onChange={() => {}}
                                pointerEvents="none"
                                display="none"
                              />
                              <Text
                                textDecoration={
                                  checkedItems[ingredient.name]
                                    ? "line-through"
                                    : "none"
                                }
                                color={
                                  checkedItems[ingredient.name]
                                    ? "gray.600"
                                    : colorMode === "light"
                                    ? "white"
                                    : "white"
                                }
                              >
                                {ingredient.name}
                                <span
                                  style={{
                                    fontSize: "0.8em",
                                    color: "#888",
                                    marginLeft: 8,
                                  }}
                                >
                                  （{ingredient.menuNames.join("/")}）
                                </span>
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      </Box>
                    );
                  })}
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={onIngredientsModalClose}
                >
                  閉じる
                </Button>
                <Button
                  colorScheme="green"
                  mr={3}
                  onClick={onApplyConfirmModalOpen}
                >
                  反映
                </Button>
                <Button colorScheme="red" onClick={resetCheckedItems}>
                  リストをクリア
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={isRecipeModalOpen}
            onClose={onRecipeModalClose}
            size="md"
          >
            <ModalOverlay />
            <ModalContent>
              {/* <ModalHeader>作り方</ModalHeader> */}
              <ModalCloseButton />
              <ModalBody>
                <Text whiteSpace="pre-wrap">{selectedRecipe}</Text>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={onRecipeModalClose}>
                  閉じる
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={isDeleteConfirmModalOpen}
            onClose={onDeleteConfirmModalClose}
            size="sm"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>削除の確認</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>このメニューアイテムを削除してもよろしいですか？</Text>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={handleDeleteConfirm}>
                  削除
                </Button>
                <Button variant="ghost" onClick={onDeleteConfirmModalClose}>
                  キャンセル
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={isCompleteConfirmModalOpen}
            onClose={onCompleteConfirmModalClose}
            size="sm"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>完了の確認</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>この注文を完了しますか？</Text>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="green"
                  mr={3}
                  onClick={() => handleCompleteConfirm(false)}
                >
                  完了にする
                </Button>
                <Button
                  colorScheme="orange"
                  mr={3}
                  onClick={() => handleCompleteConfirm(true)}
                >
                  売り切れにして完了
                </Button>
                <Button variant="ghost" onClick={onCompleteConfirmModalClose}>
                  キャンセル
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={isLocationModalOpen}
            onClose={onLocationModalClose}
            size="sm"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>売り場を選択</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={2} align="stretch">
                  {locations.map((location) => (
                    <Button
                      key={location}
                      onClick={() => handleLocationSelect(location)}
                      variant="ghost"
                      justifyContent="flex-start"
                    >
                      {location}
                    </Button>
                  ))}
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={isApplyConfirmModalOpen}
            onClose={onApplyConfirmModalClose}
            size="sm"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>確認</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  選択した材料で作れるメニューを表示し、それ以外を非表示にします。
                  また、全てのメニューの売り切れ状態を解除します。
                  よろしいですか？
                </Text>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={applySelectedIngredients}
                >
                  反映する
                </Button>
                <Button variant="ghost" onClick={onApplyConfirmModalClose}>
                  キャンセル
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </Content>
  );
}
