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
            popOver:
              "分解元のデータ\nこれは開発者の確認用で通常は使用しません\n※単線分析リクエストの管理No.毎に保存されます",
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
            popOver:
              "分解したデータ\nこれは古い生産準備+で使用していたもので通常は使用しません",
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
            name: "010_部材使用量_分解_in",
            type: "folder",
            children: [
              { name: "N90195_MRP.TXT", type: "file" },
              { name: "RLTF*B*_.txt", type: "file" },
            ],
          },
          {
            name: "011_部材使用量_分解_out",
            type: "folder",
          },
          {
            name: "100_部材使用量_品番別",
            type: "folder",
          },
        ],
      },
      {
        name: "01_PVSW_csv",
        type: "folder",
        children: [{ name: "PVSW***.csv", type: "file" }],
      },
      {
        name: "05_RLTF_A",
        type: "folder",
        popOver: "生準+からRLTF-Aを指定するのに使用します",
      },
      {
        name: "06_RLTF_B",
        type: "folder",
        popOver: "生準+からRLTF-Bを指定するのに使用します",
      },
      {
        name: "07_SUB",
        type: "folder",
        popOver:
          "社内図のサブ形態で生産する時にSUBデータを入れます。通常は使用しません",
        children: [
          { name: "製品品番1-A01-SUB.csv", type: "file" },
          { name: "製品品番2-B02-SUB.csv", type: "file" },
          { name: "製品品番3-C03-SUB.csv", type: "file" },
        ],
      },
      {
        name: "08_hsfデータ変換",
        type: "folder",
        children: [
          { name: "製品品番1_____A0011_MD_20240614200253", type: "folder" },
        ],
      },
      {
        name: "08_MD",
        type: "folder",
        children: [
          {
            name: "製品品番1_A01_MD",
            type: "folder",
          },
          {
            name: "製品品番2_B02_MD",
            type: "folder",
          },
          {
            name: "製品品番3_C03_MD",
            type: "folder",
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
