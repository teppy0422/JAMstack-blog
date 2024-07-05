import React, { useState } from "react";
import {
  Box,
  Text,
  VStack,
  IconButton,
  useColorMode,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  Collapse,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  InfoIcon,
  InfoOutlineIcon,
} from "@chakra-ui/icons";

// ディレクトリとファイルのデータ型定義
type FileSystemItem = {
  name: string;
  type: "folder" | "file";
  children?: FileSystemItem[];
  popOver?: string;
  isOpen?: boolean;
};

// フォルダとファイルを表示するコンポーネント
const FileSystemNode: React.FC<{ item: FileSystemItem; isLast?: boolean }> = ({
  item,
  isLast = false,
}) => {
  const [isOpen, setIsOpen] = useState(item.isOpen ?? true);
  const toggleOpen = () => setIsOpen(!isOpen);
  const { colorMode } = useColorMode();

  const lineStyle = {
    borderLeft: "1px solid gray",
    marginLeft: 0,
    paddingLeft: 0,
  };
  return (
    <VStack align="start" spacing={0}>
      <Box display="flex" alignItems="center">
        {item.type === "folder" ? (
          <>
            <IconButton
              icon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
              aria-label="Toggle Folder"
              size="sm"
              onClick={toggleOpen}
              variant="ghost"
              _hover={{
                bg: "transparent",
                transition: "background 0.2s ease-in-out",
              }}
            />
            <Text fontWeight="bold" pl={0}>
              {item.name}
            </Text>
          </>
        ) : (
          <Text pl={4}>{item.name}</Text>
        )}
        {item.popOver && (
          <Popover placement="right-start">
            <PopoverTrigger>
              <IconButton
                icon={<InfoIcon style={{ fontWeight: "bold" }} />}
                aria-label="Info"
                size="sm"
                variant="ghost"
                _hover={{
                  bg: "transparent",
                  transition: "background 0.2s ease-in-out",
                }}
                colorScheme={colorMode === "light" ? "purple" : "yellow"}
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <Text p={4}>
                {" "}
                {item.popOver.split("\n").map((line, index) => (
                  <Text key={index}>{line}</Text>
                ))}
              </Text>
            </PopoverContent>
          </Popover>
        )}
      </Box>
      <Collapse in={isOpen} animateOpacity>
        <Box pl={4}>
          {item.children?.map((child, index) => (
            <Box
              key={index}
              // 99行目の修正
              {...(index < (item.children?.length ?? 0) - 1 ? lineStyle : {})}
            >
              <FileSystemNode
                item={child}
                isLast={index === (item.children?.length ?? 0) - 1}
              />
            </Box>
          ))}
        </Box>
      </Collapse>
    </VStack>
  );
};

// アプリケーションのメインコンポーネント
const App: React.FC = () => {
  return (
    <Box p={5}>
      <Text>welcome</Text>
    </Box>
  );
};

export { FileSystemNode };
