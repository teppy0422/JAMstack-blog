import React, { useState } from "react";
import { Box, Badge } from "@chakra-ui/react";

const projectOptions = [
  { value: "生産準備+", color: "custom.excel" },
  { value: "CAMERA+", color: "custom.dotnet" },
  { value: "誘導ナビ.net", color: "custom.dotnet" },
  { value: "部材一覧+", color: "custom.excel" },
  { value: "順立生産システム", color: "custom.access" },
  { value: "誘導ポイント設定一覧表", color: "custom.excel" },
  { value: "このWEBアプリ", color: "custom.front" },
  { value: "その他", color: "gray" },
  { value: "追加/修正", color: "blue" },
  { value: "不具合", color: "red" },
  { value: "提案", color: "purple" },
];
export const getProjectOptionsColor = (value: string) => {
  const option = projectOptions.find((opt) => opt.value === value);
  return option ? option.color : "transparent";
};

interface ProjectListsProps {
  colorMode: "light" | "dark";
  onProjectClick: (clickedProject: string | null) => void;
}
export const ProjectLists: React.FC<ProjectListsProps> = ({
  colorMode,
  onProjectClick,
}) => {
  const [clicked, setClicked] = useState<string | null>(null);

  const myBadge = (text: string) => {
    const isClicked = clicked === text;
    const bg = getProjectOptionsColor(text);
    return (
      <Box
        display="inline-block"
        fontFamily="Noto Sans Jp"
        fontWeight={400}
        fontSize={14}
        borderRadius={3}
        px={1}
        mr={2}
        cursor="pointer"
        border={isClicked ? "solid 1px transparent" : "solid 1px #000"}
        bg={isClicked ? bg : "transparent"}
        color={isClicked ? "#FFF" : "#000"}
        onClick={() => {
          const newClicked = isClicked ? null : text;
          setClicked(newClicked);
          onProjectClick(newClicked);
        }}
        _hover={{ bg: bg }}
      >
        {text}
      </Box>
    );
  };

  return (
    <Box>
      {myBadge("生産準備+")}
      {myBadge("CAMERA+")}
      {myBadge("誘導ナビ.net")}
      <br />
      {myBadge("部材一覧+")}
      <br />
      {myBadge("順立生産システム")}
      <br />
      {myBadge("誘導ポイント設定一覧表")}
      <br />
      {myBadge("このWEBアプリ")}
      <br />
      {myBadge("その他")}
    </Box>
  );
};

interface CategoryListsProps {
  colorMode: "light" | "dark";
  onCategoryClick: (clickedCategory: string | null) => void;
  userMainCompany: string | null;
}
export const CategoryLists: React.FC<CategoryListsProps> = ({
  colorMode,
  onCategoryClick,
  userMainCompany,
}) => {
  const [clicked, setClicked] = useState<string | null>(null);
  const myBadge = (text: string) => {
    const isClicked = clicked === text;
    const bg = getProjectOptionsColor(text);
    return (
      <Box
        display="inline-block"
        fontFamily="Noto Sans Jp"
        fontWeight={400}
        fontSize={14}
        borderRadius={3}
        px={1}
        mr={2}
        cursor="pointer"
        border={isClicked ? "solid 1px " + bg : "solid 1px #000"}
        bg={isClicked ? "transparent" : "transparent"}
        color={isClicked ? bg : "#000"}
        onClick={() => {
          const newClicked = isClicked ? null : text;
          setClicked(newClicked);
          onCategoryClick(newClicked);
        }}
        _hover={{ bg: "#eee" }}
      >
        {text}
      </Box>
    );
  };
  return (
    <Box>
      {myBadge("追加/修正")}
      <br />
      {myBadge("不具合")}
      <br />
      {myBadge("その他")}
      {userMainCompany === "開発" && (
        <>
          <br />
          {myBadge("提案")}
        </>
      )}
    </Box>
  );
};
export const CustomBadge: React.FC<{ text: string }> = ({ text }) => {
  switch (text) {
    case "生準+":
      return (
        <Badge variant="outline" bg="green.500" color="white" mr={1}>
          生準+
        </Badge>
      );
    case "開発":
      return (
        <Badge bg="red.500" color="white" mr={1}>
          開発
        </Badge>
      );
    case "作成途中":
      return (
        <Badge bg="red.500" color="white" mr={1}>
          作成途中
        </Badge>
      );
    // 他のケースを追加
    default:
      return (
        <Badge bg="gray.500" color="white" mr={1}>
          {text}
        </Badge>
      );
  }
};
