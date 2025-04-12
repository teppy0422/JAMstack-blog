"use client";

import { useState, useEffect, useRef } from "react";
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
} from "@chakra-ui/react";
import { supabase } from "../../utils/supabase/client";
import { VscAccount } from "react-icons/vsc";
import imageCompression from "browser-image-compression";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  ingredients: string[];
  is_visible: boolean;
}

interface Order {
  id: number;
  items: { item: MenuItem; quantity: number }[];
  total: number;
  created_at: string;
  status: "pending" | "completed";
}

export default function AdminPage() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isIngredientsModalOpen,
    onOpen: onIngredientsModalOpen,
    onClose: onIngredientsModalClose,
  } = useDisclosure();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    price: undefined,
    category: "",
    imageUrl: "",
    ingredients: [],
    is_visible: true,
  });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [ingredientInputs, setIngredientInputs] = useState<string[]>([""]);
  const [orders, setOrders] = useState<Order[]>([]);

  const categories = [
    "ドリンク",
    "おつまみ",
    "サラダ",
    "刺身",
    "焼き物",
    "揚げ物",
  ];

  useEffect(() => {
    fetchMenuItems();
    fetchOrders();
    setupRealtimeSubscription();
  }, []);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from("order_menu_items")
      .select("*")
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

    // 画像URLを修正
    const itemsWithCorrectImageUrl =
      data?.map((item) => ({
        ...item,
        imageUrl: item.image_url, // image_urlからimageUrlに変換
      })) || [];

    setMenuItems(itemsWithCorrectImageUrl);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
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
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleOrderStatusChange = async (
    orderId: number,
    newStatus: "pending" | "completed"
  ) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast({
        title: "エラー",
        description: "注文ステータスの更新に失敗しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    fetchOrders();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // プレビュー表示
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
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

      setNewItem({ ...newItem, imageUrl: publicUrl });
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
      .map((ingredient) => ingredient.trim());

    if (editingItem) {
      const { error } = await supabase
        .from("order_menu_items")
        .update({
          name: newItem.name,
          price: newItem.price,
          category: newItem.category,
          image_url: newItem.imageUrl,
          ingredients: validIngredients,
          is_visible: newItem.is_visible,
        })
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
    } else {
      const { error } = await supabase.from("order_menu_items").insert([
        {
          name: newItem.name,
          price: newItem.price,
          category: newItem.category,
          image_url: newItem.imageUrl,
          ingredients: validIngredients,
          is_visible: newItem.is_visible,
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

    setNewItem({
      name: "",
      price: undefined,
      category: "",
      imageUrl: "",
      ingredients: [],
      is_visible: true,
    });
    setPreviewImage("");
    setEditingItem(null);
    setIngredientInputs([""]);
    onClose();
    fetchMenuItems();
  };

  const handleEdit = async (item: MenuItem) => {
    // 既存の画像がある場合、新しい画像が選択されたら古い画像を削除
    if (item.imageUrl && newItem.imageUrl !== item.imageUrl) {
      try {
        const oldImagePath = item.imageUrl.split("/").pop();
        if (oldImagePath) {
          const { error: deleteImageError } = await supabase.storage
            .from("menu-image")
            .remove([oldImagePath]);

          if (deleteImageError) {
            console.error("Error deleting old image:", deleteImageError);
          }
        }
      } catch (error) {
        console.error("Error in image deletion:", error);
      }
    }

    setEditingItem(item);
    setNewItem({
      name: item.name,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl,
      ingredients: item.ingredients,
      is_visible: item.is_visible,
    });
    setPreviewImage(item.imageUrl);
    setIngredientInputs([...item.ingredients, ""]);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    // 削除するアイテムの画像URLを取得
    const itemToDelete = menuItems.find((item) => item.id === id);
    if (!itemToDelete) return;

    try {
      // 画像ファイル名を取得
      const imagePath = itemToDelete.imageUrl.split("/").pop();
      if (imagePath) {
        // Supabase Storageから画像を削除
        const { error: deleteImageError } = await supabase.storage
          .from("menu-image")
          .remove([imagePath]);

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

  return (
    <Box p={4}>
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
        <VStack spacing={4} align="stretch" mb={8}>
          {orders.map((order) => (
            <Box
              key={order.id}
              p={4}
              bg={colorMode === "light" ? "white" : "gray.700"}
              borderRadius="md"
            >
              <VStack align="stretch" spacing={2}>
                <HStack justify="space-between">
                  <Text fontWeight="bold">注文ID: {order.id}</Text>
                  <Text>
                    注文日時: {new Date(order.created_at).toLocaleString()}
                  </Text>
                </HStack>
                <Text fontWeight="bold">合計: {order.total}円</Text>
                <Text>
                  ステータス: {order.status === "pending" ? "処理中" : "完了"}
                </Text>
                <VStack align="stretch" spacing={2}>
                  {order.items.map((item, index) => (
                    <HStack key={index} spacing={4}>
                      <Image
                        src={item.item.imageUrl}
                        alt={item.item.name}
                        boxSize="50px"
                        objectFit="cover"
                        borderRadius="md"
                        fallbackSrc="https://placehold.jp/150x150.png"
                      />
                      <Box>
                        <Text fontWeight="bold">{item.item.name}</Text>
                        <Text>
                          {item.quantity}個 × {item.item.price}円
                        </Text>
                      </Box>
                    </HStack>
                  ))}
                </VStack>
                <HStack justify="flex-end">
                  <Button
                    size="sm"
                    colorScheme={order.status === "pending" ? "green" : "gray"}
                    onClick={() =>
                      handleOrderStatusChange(order.id, "completed")
                    }
                    isDisabled={order.status === "completed"}
                  >
                    完了
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ))}
        </VStack>

        <Heading size="md" mb={4}>
          menu
        </Heading>
        <VStack spacing={4} align="stretch">
          {menuItems.map((item) => (
            <HStack
              key={item.id}
              p={4}
              bg={colorMode === "light" ? "white" : "gray.700"}
              borderRadius="md"
              justify="space-between"
            >
              <HStack spacing={4} flex={1}>
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  boxSize="100px"
                  objectFit="cover"
                  mb={2}
                  fallbackSrc="https://placehold.jp/150x150.png"
                />
                <Box>
                  <Text fontWeight="bold">{item.name}</Text>
                  <Text>価格: {item.price}円</Text>
                  <Text>カテゴリ: {item.category}</Text>
                  <Text>材料: {item.ingredients.join(", ")}</Text>
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
                  onClick={() => handleDelete(item.id)}
                >
                  削除
                </Button>
              </VStack>
            </HStack>
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
                    <FormLabel>画像</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      display="none"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      colorScheme="blue"
                      variant="outline"
                      w="full"
                    >
                      画像を選択
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
                    <FormLabel>材料</FormLabel>
                    <VStack spacing={2} align="stretch">
                      {ingredientInputs.map((ingredient, index) => (
                        <Input
                          key={index}
                          value={ingredient}
                          onChange={(e) =>
                            handleIngredientChange(index, e.target.value)
                          }
                          placeholder="材料を入力"
                          mb={2}
                        />
                      ))}
                    </VStack>
                  </FormControl>

                  <FormControl>
                    <Checkbox
                      isChecked={newItem.is_visible}
                      onChange={(e) =>
                        setNewItem({ ...newItem, is_visible: e.target.checked })
                      }
                    >
                      注文ページで表示
                    </Checkbox>
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
              <VStack align="stretch" spacing={2}>
                {Array.from(
                  new Set(
                    menuItems
                      .filter((item) => item.is_visible)
                      .flatMap((item) => item.ingredients)
                  )
                ).map((ingredient) => (
                  <Text
                    key={ingredient}
                    p={2}
                    bg={colorMode === "light" ? "gray.50" : "gray.700"}
                    borderRadius="md"
                  >
                    {ingredient}
                  </Text>
                ))}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onIngredientsModalClose}>
                閉じる
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
