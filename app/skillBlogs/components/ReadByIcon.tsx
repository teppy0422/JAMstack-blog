import React, { ReactNode, useState, useRef, useLayoutEffect } from "react";
import { IconButton, useColorMode, createIcon, Box } from "@chakra-ui/react";

const CustomIcon2 = createIcon({
  displayName: "CustomIcon2",
  viewBox: "0 0 26 26",
  path: (
    <path
      d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
      fill="currentColor"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
});

type ReadByIconProps = {
  content: ReactNode;
  isRead: boolean;
};
export default function ReadByIcon({ content, isRead }: ReadByIconProps) {
  const { colorMode } = useColorMode();
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState("33px");

  const [measuredHeight, setMeasuredHeight] = useState(0);
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
      onClick={() => setOpen((prev) => !prev)}
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
                <CustomIcon2
                  viewBox="0 0 24 24"
                  color={isRead ? "#eee" : "gray.400"}
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
