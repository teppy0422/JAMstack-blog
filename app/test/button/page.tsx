"use client";

import React from "react";
import {
  ChakraProvider,
  Box,
  Button,
  Grid,
  useToast,
  Text,
} from "@chakra-ui/react";
import CustomToast from "@/components/ui/CustomToast";
import getMessage from "@/utils/getMessage";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Page() {
  const toast = useToast();
  const { language } = useLanguage();
  type ToastPosition =
    | "top"
    | "top-left"
    | "top-right"
    | "bottom"
    | "bottom-left"
    | "bottom-right";

  const handleToastClick = ({
    title,
    description,
    toastPosition = "bottom",
  }: {
    title: string;
    description: React.ReactNode;
    toastPosition?: ToastPosition;
  }) => {
    toast({
      position: toastPosition,
      duration: 5000,
      isClosable: true,
      render: ({ onClose }) => (
        <CustomToast
          onClose={onClose}
          title={title}
          description={description}
        />
      ),
    });
  };
  // toastだけで使うならこれ
  const showToast = useToast();
  showToast({
    position: "bottom",
    duration: 4000,
    isClosable: true,
    render: ({ onClose }) => (
      <CustomToast
        onClose={onClose}
        title={getMessage({
          ja: "閲覧できません",
          us: "Cannot view",
          cn: "无法查看",
          language,
        })}
        description={
          <>
            <Box>
              {getMessage({
                ja: "閲覧できるのは同じ会社のみです",
                us: "Only the same company can view",
                cn: "只有同一家公司可以查看",
                language,
              })}
            </Box>
          </>
        }
      />
    ),
  });
  return (
    <ChakraProvider>
      <Text my={4} ml={4}>
        @/components/ui/CustomToast
      </Text>
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        bg="gray.50"
        py={2}
        px={3}
      >
        <Grid
          templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gap={6}
          w="full"
          maxW="800px"
        >
          <Button
            colorScheme="teal"
            onClick={() =>
              handleToastClick({
                title: "通知タイトル 1",
                description: (
                  <>
                    <Box fontSize="14px" fontWeight="600">
                      タイトル1
                    </Box>
                    <Box fontSize="12px">これは説明文です。</Box>
                  </>
                ),
              })
            }
          >
            トースト1
          </Button>
          <Button
            colorScheme="blue"
            onClick={() =>
              handleToastClick({
                title: "通知タイトル 2",
                description: (
                  <>
                    <Box fontSize="14px" fontWeight="600">
                      タイトル2
                    </Box>
                    <Box fontSize="12px">別の説明文です。</Box>
                  </>
                ),
              })
            }
          >
            トースト2
          </Button>
          <Button
            colorScheme="pink"
            onClick={() =>
              handleToastClick({
                title: "通知タイトル 3",
                description: (
                  <>
                    <Box fontSize="14px" fontWeight="600">
                      タイトル3
                    </Box>
                    <Box fontSize="12px">さらに別の説明です。</Box>
                  </>
                ),
              })
            }
          >
            トースト3
          </Button>
          {/* ボタンを追加するだけで自動で整列されます */}
        </Grid>
      </Box>
    </ChakraProvider>
  );
}
