"use client";

import { useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import { Badge, Box, Flex, useMediaQuery } from "@chakra-ui/react";
import ResponsiveModal from "@/components/responsiveModal";

const truncatedText = (text: string, maxLength: number) => {
  return text.length > 20 ? text.slice(0, maxLength) + "..." : text;
};

const CustomModalTab: React.FC<{
  path: string;
  text: string;
  media: string;
}> = ({ path, text, media }) => {
  const [isBase] = useMediaQuery("(max-width: 480px)");
  const maxLen = isBase ? 16 : 99;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalPath, setModalPath] = useState("");

  const handleBoxClick = (path) => {
    setModalPath(path);
    onOpen();
  };
  return (
    <>
      <Badge
        variant={path ? "solid" : "outline"} // pathが空の場合はoutline
        colorScheme={path ? undefined : "gray"} // pathが空の場合はgrayのカラースキーム
        bg={path ? "#555" : undefined} // pathが空でない場合は背景色を設定
        color={path ? "white" : undefined} // pathが空でない場合は文字色を設定
        display="inline-block"
        cursor={path ? "pointer" : "default"}
        _hover={path ? { bg: "#333" } : undefined}
        onClick={path ? () => handleBoxClick(path) : undefined}
        transition={"all 0.3s ease-in-out"}
      >
        <Flex alignItems="center">
          <Box mr={0}>{truncatedText(text, maxLen)}</Box>
          {media === "movie" ? (
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="20px"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.437,19.937H4.562a2.5,2.5,0,0,1-2.5-2.5V6.563a2.5,2.5,0,0,1,2.5-2.5H19.437a2.5,2.5,0,0,1,2.5,2.5V17.437A2.5,2.5,0,0,1,19.437,19.937ZM4.562,5.063a1.5,1.5,0,0,0-1.5,1.5V17.437a1.5,1.5,0,0,0,1.5,1.5H19.437a1.5,1.5,0,0,0,1.5-1.5V6.563a1.5,1.5,0,0,0-1.5-1.5Z"></path>
              <path d="M14.568,11.149,10.6,8.432a1.032,1.032,0,0,0-1.614.851v5.434a1.032,1.032,0,0,0,1.614.851l3.972-2.717A1.031,1.031,0,0,0,14.568,11.149Z"></path>
            </svg>
          ) : media === "html" ? (
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 240 240"
              height="20px"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M214,120V88a6,6,0,0,0-1.76-4.24l-56-56A6,6,0,0,0,152,26H56A14,14,0,0,0,42,40v80a6,6,0,0,0,12,0V40a2,2,0,0,1,2-2h90V88a6,6,0,0,0,6,6h50v26a6,6,0,0,0,12,0ZM158,46.48,193.52,82H158ZM66,160v48a6,6,0,0,1-12,0V190H30v18a6,6,0,0,1-12,0V160a6,6,0,0,1,12,0v18H54V160a6,6,0,0,1,12,0Zm56,0a6,6,0,0,1-6,6H106v42a6,6,0,0,1-12,0V166H84a6,6,0,0,1,0-12h32A6,6,0,0,1,122,160Zm72,0v48a6,6,0,0,1-12,0V178l-13.2,17.6a6,6,0,0,1-9.6,0L146,178v30a6,6,0,0,1-12,0V160a6,6,0,0,1,10.8-3.6L164,182l19.2-25.6A6,6,0,0,1,194,160Zm56,48a6,6,0,0,1-6,6H216a6,6,0,0,1-6-6V160a6,6,0,0,1,12,0v42h22A6,6,0,0,1,250,208Z"></path>
            </svg>
          ) : null}
        </Flex>
      </Badge>
      <ResponsiveModal
        isOpen={isOpen}
        onClose={onClose}
        modalPath={modalPath}
      />
    </>
  );
};
export default CustomModalTab;
