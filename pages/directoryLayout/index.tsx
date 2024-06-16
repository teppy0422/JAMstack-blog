import React from "react";
import Content from "../../components/content";
import Link from "next/link";
import { Image, Text, Box, SimpleGrid, Badge, Kbd } from "@chakra-ui/react";
import { MdSettings, MdCheckCircle } from "react-icons/md";
import NextImage from "next/image";
import { FileSystemNode } from "../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート

import styles from "../../styles/home.module.scss";

import Hippo_001_wrap from "../../components/3d/hippo_001_wrap";

import CustomLinkBox from "../../components/customLinkBox";
import CustomPopver from "../../components/popver";

export default function About() {
  const illusts = [{ src: "/images/illust/hippo/hippo_001.png" }];

  type FileSystemItem = {
    name: string;
    type: "folder" | "file"; // 'folder' または 'file' のみを許可する
    children?: FileSystemItem[];
    popOver?: string;
  };
  // ディレクトリ構造のデータ
  const directoryData: FileSystemItem = {
    name: "Sjp*.xlsmがあるフォルダ",
    type: "folder",
    children: [
      {
        name: "00_temp",
        type: "folder",
        popOver:
          "入手したRLTF-AとRLTF-Bを分解する為にはその2ファイルのみをここに入れます",
        children: [
          {
            name: "001_テキストデータ",
            type: "folder",
            popOver: "分解元のデータ\nこれは開発者の確認用で通常は使用しません",
            children: [
              {
                name: "N090195",
                type: "folder",
                children: [
                  { name: "N090195_KairoMat_3.txt", type: "file" },
                  { name: "N090195_MRP.TXT", type: "file" },
                  { name: "RLTF*A*.TXT", type: "file" },
                  { name: "RLTF*B*.TXT", type: "file" },
                ],
              },
            ],
          },
          {
            name: "002_エクセルデータ",
            type: "folder",
            children: [
              {
                name: "N090195",
                type: "folder",
                children: [
                  { name: "仕分けリスト", type: "file" },
                  { name: "部品リスト", type: "file" },
                  { name: "N090195_製品別回路マトリクス.xls", type: "file" },
                  { name: "N090195_部材所要量.xls", type: "file" },
                ],
              },
            ],
          },
          {
            name: "01_PVSW_csv",
            type: "folder",
            children: [{ name: "PVSW***.csv", type: "file" }],
          },
        ],
      },
    ],
  };
  return (
    <Content isCustomHeader={true}>
      <div className={styles.me} style={{ paddingTop: "50px" }}>
        <Box textAlign="center" mb={8}>
          <Text fontSize="lg" colorScheme="black"></Text>
        </Box>
        <FileSystemNode item={directoryData} />
      </div>
    </Content>
  );
}
