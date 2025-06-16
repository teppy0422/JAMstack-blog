import React, { ReactNode, useState, useRef, useLayoutEffect } from "react";
import { IconButton, useColorMode, createIcon, Box } from "@chakra-ui/react";
import { LuBookCheckIcon } from "@/components/ui/icons";

type ReadByIconProps = {
  content: ReactNode;
  isRead: boolean;
  open: boolean;
  onToggleOpen?: () => void;
};
export default function ReadByIcon({
  content,
  isRead,
  open,
  onToggleOpen,
}: ReadByIconProps) {
  const { colorMode } = useColorMode();
  const [height, setHeight] = useState("33px");
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight + 8;
      setHeight(open ? `${scrollHeight}px` : "41px");
    }
  }, [open, content]); // 開閉のたびに高さを再計測

  return (
    <Box
      ref={contentRef}
      onClick={onToggleOpen}
      overflow="hidden"
      transition="all .4s ease-in-out"
      maxHeight={height}
    >
      <Box my={1}>
        {open ? (
          <> {content}</>
        ) : (
          <>
            <IconButton
              icon={
                <LuBookCheckIcon
                  size="20px"
                  stroke={
                    isRead
                      ? colorMode === "light"
                        ? "black"
                        : "white"
                      : colorMode === "light"
                      ? "#e53e3e"
                      : "orange"
                  }
                />
              }
              border="1px solid"
              borderColor={colorMode === "light" ? "black" : "white"}
              borderRadius="full"
              minW="32px"
              w="32px"
              h="32px"
              aria-label="既読数"
            />
          </>
        )}
      </Box>
    </Box>
  );
}
