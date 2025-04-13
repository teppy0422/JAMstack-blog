"use client";

import { useState, useEffect } from "react";
import {
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
} from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
import { useUserContext } from "../../context/useUserContext";
import Content from "../../components/content";
import { AnimationImage } from "../../components/CustomImage";
import "@fontsource/yomogi";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  ingredients: string[];
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

export default function OrderPage() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const gridColumns = useBreakpointValue({ base: 2, md: 3, lg: 4 });
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
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from("order_menu_items")
      .select("*")
      .eq("is_visible", true)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching menu items:", error);
      return;
    }

    const itemsWithCorrectImageUrl =
      data?.map((item) => ({
        ...item,
        imageUrl: item.image_url,
      })) || [];

    setMenuItems(itemsWithCorrectImageUrl);
  };

  const categories = [
    "すべて",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  const filteredItems =
    selectedCategory === "すべて"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
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
  return (
    <Content isCustomHeader={true}>
      <Box p={4}>
        <Heading mb={6} textAlign="center" fontFamily="Yomogi" fontWeight="600">
          居酒屋ぼん
        </Heading>

        <Box mb={2}>
          <Tabs variant="soft-rounded">
            <TabList overflowX="auto" pb={2}>
              {categories.map((category) => (
                <Tab
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  bg={
                    selectedCategory === category
                      ? "custom.theme.light.400"
                      : undefined
                  }
                  color={selectedCategory === category ? "white" : undefined}
                >
                  {category}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "3fr 1fr" }} gap={4}>
          <Box>
            <SimpleGrid
              columns={gridColumns}
              spacing={4}
              fontFamily="Yomogi"
              fontWeight="600"
            >
              {filteredItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => addToCart(item)}
                  p={2}
                  h="auto"
                  bg={colorMode === "light" ? "white" : "gray.700"}
                  _hover={{
                    bg: colorMode === "light" ? "gray.100" : "gray.600",
                  }}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    maxH="100px"
                    objectFit="cover"
                    borderRadius="md"
                    mb={2}
                    fallbackSrc="https://placehold.jp/150x150.png"
                  />
                  <AnimationImage
                    src={item.imageUrl}
                    height="100px"
                    position="static"
                  />
                  <Text mt={1}>{item.name}</Text>
                  <Text fontSize="sm">{item.price}円</Text>
                </Button>
              ))}
            </SimpleGrid>
          </Box>

          <Box
            position={{ base: "static", md: "fixed" }}
            top="64px"
            right="10px"
          >
            <Heading size="sm" mb={1}>
              <Center>注文内容</Center>
            </Heading>
            <VStack spacing={1} align="stretch">
              {cart.map((cartItem) => (
                <Box
                  key={cartItem.item.id}
                  p={4}
                  bg={colorMode === "light" ? "white" : "gray.700"}
                  borderRadius="md"
                >
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
                      <Text fontWeight="bold">{cartItem.item.name}</Text>
                      <Text>
                        {cartItem.quantity}個 × {cartItem.item.price}円
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              ))}
              <Box
                mt={1}
                p={2}
                bg={
                  colorMode === "light" ? "custom.theme.light.100" : "gray.800"
                }
              >
                <Text fontWeight="bold">合計: {calculateTotal()}円</Text>
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
                  isDisabled={cart.length === 0}
                  w="full"
                >
                  注文を確定
                </Button>
              </Box>
            </VStack>
          </Box>
        </Grid>
      </Box>
    </Content>
  );
}
