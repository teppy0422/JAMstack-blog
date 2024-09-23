import React, { useEffect, useState } from "react";
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
import Sidebar from "../../components/sidebar"; // Sidebar コンポーネントをインポート

export default function About() {
  const [isClient, setIsClient] = useState(false);
  const illusts = [{ src: "/images/illust/hippo/hippo_001.png" }];
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null; // クライアントサイドでのみレンダリング
  }
  type FileSystemItem = {
    name: string;
    type: "folder" | "file"; // 'folder' または 'file' のみを許可する
    children?: FileSystemItem[];
    popOver?: string;
    isOpen?: boolean;
  };
  // ディレクトリ構造のデータ
  const directoryData: FileSystemItem = {
    name: "Sjp*.xlsmがあるフォルダ",
    type: "folder",
    children: [
      {
        name: "00_temp",
        type: "folder",
        isOpen: false,
        popOver:
          "入手したRLTF-AとRLTF-Bを分解する為にはその2ファイルのみをここに入れます",
        children: [
          {
            name: "001_テキストデータ",
            type: "folder",
            isOpen: false,
            popOver:
              "分解元のデータ\nこれは開発者の確認用で通常は使用しません\n※単線分析リクエストの管理No.毎に保存されます",
            children: [
              {
                name: "N090195",
                type: "folder",
                isOpen: false,
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
            isOpen: false,
            popOver:
              "分解したデータ\nこれは古い生産準備+で使用していたもので通常は使用しません",
            children: [
              {
                name: "N090195",
                type: "folder",
                isOpen: false,
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
            isOpen: false,
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
        popOver:
          "入手したPVSW.csvを入れます。生産準備+のPVSWインポートのターゲットフォルダです。インポート後は適当な名前のフォルダを付けて保存してください",
        isOpen: false,
        children: [{ name: "PVSW***.csv", type: "file" }],
      },
      {
        name: "05_RLTF_A",
        type: "folder",
        isOpen: false,
        popOver: "生準+からRLTF-Aを指定するのに使用します",
        children: [{ name: "RLTF17A*.txt", type: "file" }],
      },
      {
        name: "06_RLTF_B",
        type: "folder",
        isOpen: false,
        popOver: "生準+からRLTF-Bを指定するのに使用します",
        children: [{ name: "RLTF17B*.txt", type: "file" }],
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
        popOver: "ここに入手したMDデータを入れて変換します",
        children: [
          {
            name: "製品品番1_____A0011_MD_20240614200253",
            type: "folder",
            popOver: "入手したMDデータ",
            isOpen: false,
            children: [
              { name: "製品品番1_____A0011_5200comb.csv", type: "file" },
              { name: "製品品番1_____A0011_5201node.csv", type: "file" },
              { name: "製品品番1_____A0011_5202sgmt.csv", type: "file" },
              { name: "製品品番1_____A0011_5203size.csv", type: "file" },
              { name: "製品品番1_____A0011_5204tape.csv", type: "file" },
              { name: "製品品番1_____A0011_5205tube.csv", type: "file" },
              { name: "製品品番1_____A0011_5206shet.csv", type: "file" },
              { name: "製品品番1_____A0011_5207part.csv", type: "file" },
              { name: "製品品番1_____A0011_5208cnct.csv", type: "file" },
              { name: "製品品番1_____A0011_5209wire.csv", type: "file" },
              { name: "製品品番1_____A0011_5210cavi.csv", type: "file" },
              { name: "製品品番1_____A0011_5211nail.csv", type: "file" },
              { name: "製品品番1_____A0011_5213geom.csv", type: "file" },
              { name: "製品品番1_____A0011_5214subcnct.csv", type: "file" },
              { name: "製品品番1_____A0011_5215subwire.csv", type: "file" },
              { name: "製品品番1_____A0011_5216subpart.csv", type: "file" },
              { name: "製品品番1_____A0011_5217code.csv", type: "file" },
              { name: "製品品番1_____A0011_5218prd2code.csv", type: "file" },
              { name: "製品品番1_____A0011_5219id2figure.csv", type: "file" },
            ],
          },
          {
            name: "WH_DataConvert.exe",
            type: "file",
            popOver: "生産準備+で使えるようにする為に変換するファイル",
          },
          {
            name: "HsfDataConvert.ini",
            type: "file",
            popOver:
              "上記.exeの設定ファイルです。生産準備+を起動する度に書き換えられます",
          },
        ],
      },
      {
        name: "08_MD",
        type: "folder",
        children: [
          {
            name: "製品品番1_A01_MD",
            type: "folder",
            popOver: "変換後のMDデータ",
            isOpen: false,
            children: [
              { name: "000Info.csv", type: "file" },
              { name: "001Node.csv", type: "file" },
              { name: "002Sgmt.csv", type: "file" },
              { name: "003Tube.csv", type: "file" },
              { name: "004Term.csv", type: "file" },
              { name: "005Part.csv", type: "file" },
              { name: "006Cone.csv", type: "file" },
              { name: "007Wire.csv", type: "file" },
              { name: "008Cavi.csv", type: "file" },
              { name: "009Tape.csv", type: "file" },
              { name: "010ID.csv", type: "file" },
              { name: "011Fuze.csv", type: "file" },
              { name: "012Hugou.csv", type: "file" },
              { name: "013Figure.csv", type: "file" },
              { name: "014Hinban.csv", type: "file" },
              { name: "015JB.csv", type: "file" },
              { name: "021TubeS.csv", type: "file" },
              { name: "022PartS.csv", type: "file" },
              { name: "023TapeS.csv", type: "file" },
              { name: "024Gromet.csv", type: "file" },
              { name: "050PartInWire.csv", type: "file" },
              { name: "0100Work40.csv", type: "file" },
              { name: "0101Work50.csv", type: "file" },
              { name: "0102Work60.csv", type: "file" },
            ],
          },
          {
            name: "製品品番2_B02_MD",
            type: "folder",
            isOpen: false,
            children: [
              { name: "000Info.csv", type: "file" },
              { name: "001Node.csv", type: "file" },
              { name: "002Sgmt.csv", type: "file" },
              { name: "003Tube.csv", type: "file" },
              { name: "004Term.csv", type: "file" },
              { name: "005Part.csv", type: "file" },
              { name: "006Cone.csv", type: "file" },
              { name: "007Wire.csv", type: "file" },
              { name: "008Cavi.csv", type: "file" },
              { name: "009Tape.csv", type: "file" },
              { name: "010ID.csv", type: "file" },
              { name: "011Fuze.csv", type: "file" },
              { name: "012Hugou.csv", type: "file" },
              { name: "013Figure.csv", type: "file" },
              { name: "014Hinban.csv", type: "file" },
              { name: "015JB.csv", type: "file" },
              { name: "021TubeS.csv", type: "file" },
              { name: "022PartS.csv", type: "file" },
              { name: "023TapeS.csv", type: "file" },
              { name: "024Gromet.csv", type: "file" },
              { name: "050PartInWire.csv", type: "file" },
              { name: "0100Work40.csv", type: "file" },
              { name: "0101Work50.csv", type: "file" },
              { name: "0102Work60.csv", type: "file" },
            ],
          },
          {
            name: "製品品番3_C03_MD",
            type: "folder",
            isOpen: false,
            children: [
              { name: "000Info.csv", type: "file" },
              { name: "001Node.csv", type: "file" },
              { name: "002Sgmt.csv", type: "file" },
              { name: "003Tube.csv", type: "file" },
              { name: "004Term.csv", type: "file" },
              { name: "005Part.csv", type: "file" },
              { name: "006Cone.csv", type: "file" },
              { name: "007Wire.csv", type: "file" },
              { name: "008Cavi.csv", type: "file" },
              { name: "009Tape.csv", type: "file" },
              { name: "010ID.csv", type: "file" },
              { name: "011Fuze.csv", type: "file" },
              { name: "012Hugou.csv", type: "file" },
              { name: "013Figure.csv", type: "file" },
              { name: "014Hinban.csv", type: "file" },
              { name: "015JB.csv", type: "file" },
              { name: "021TubeS.csv", type: "file" },
              { name: "022PartS.csv", type: "file" },
              { name: "023TapeS.csv", type: "file" },
              { name: "024Gromet.csv", type: "file" },
              { name: "050PartInWire.csv", type: "file" },
              { name: "0100Work40.csv", type: "file" },
              { name: "0101Work50.csv", type: "file" },
              { name: "0102Work60.csv", type: "file" },
            ],
          },
        ],
      },
      {
        name: "09_AutoSub",
        type: "folder",
        popOver: "生産準備+が提案したサブ形態",
        isOpen: false,
        children: [
          { name: "製品品番1_term.txt", type: "file" },
          { name: "製品品番1_wire.txt", type: "file" },
          { name: "製品品番1_wiresum.txt", type: "file" },
        ],
      },
    ],
  };
  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true}>
        <div className={styles.me}>
          <Box textAlign="center" mb={8}>
            <Text fontSize="lg" colorScheme="black">
              生産準備+のフォルダ構造
            </Text>
            <Badge variant="solid" colorScheme="green" ml={2}>
              使用者
            </Badge>
          </Box>
          <FileSystemNode item={directoryData} />
        </div>
      </Content>
    </>
  );
}
