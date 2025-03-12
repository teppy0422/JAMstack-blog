import React, { useState } from "react";
import { Box } from "@chakra-ui/react";

interface ProjectListsProps {
  colorMode: "light" | "dark";
  onProjectClick: (clickedProject: string | null) => void;
}
export const ProjectLists: React.FC<ProjectListsProps> = ({
  colorMode,
  onProjectClick,
}) => {
  const [clicked, setClicked] = useState<string | null>(null);
  const myBadge = (text: string, bg: string) => {
    const isClicked = clicked === text;
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
      {myBadge("生産準備+", "excel")}
      {myBadge("CAMERA+", "dotnet")}
      {myBadge("誘導ナビ.net", "dotnet")}
      <br />
      {myBadge("部材一覧+", "excel")}
      <br />
      {myBadge("順立生産システム", "access")}
      <br />
      {myBadge("誘導ポイント設定一覧表", "excel")}
      <br />
      {myBadge("このWEBアプリ", "front")}
      <br />
      {myBadge("その他", "gray")}
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
  const myBadge = (text: string, bg: string) => {
    const isClicked = clicked === text;
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
      {myBadge("追加/修正", "blue")}
      <br />
      {myBadge("不具合", "red")}
      <br />
      {myBadge("その他", "gray")}
      {userMainCompany === "開発" && (
        <>
          <br />
          {myBadge("提案", "purple")}
        </>
      )}
    </Box>
  );
};
