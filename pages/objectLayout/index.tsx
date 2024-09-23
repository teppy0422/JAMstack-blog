import React, { useEffect, useState } from "react";
import Content from "../../components/content";
import { Image, Text, Box, Badge, Kbd } from "@chakra-ui/react";
import { FileSystemNode } from "../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート

import styles from "../../styles/home.module.scss";
import Sidebar from "../../components/sidebar"; // Sidebar コンポーネントをインポート

export default function About() {
  const [isClient, setIsClient] = useState(false);
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
  const directoryData2: FileSystemItem = {
    name: "2.良く使うコード",
    type: "folder",
    isOpen: false,
    children: [
      {
        name: "基本的なコード",
        type: "folder",
        isOpen: false,
        children: [
          {
            name: "<code>コード</code>",
            type: "file",
            popOver: "コード",
          },
        ],
      },
    ],
  };
  // ディレクトリ構造のデータ
  const directoryData1: FileSystemItem = {
    name: "1.エクセルvbaでオブジェクト指向",
    type: "folder",
    isOpen: false,
    children: [
      {
        name: "エクセルvbaでは専用のライブラリも概念も無い為、classとcollectionを使ってオブジェクト指向を実現しています\n以下はワイヤーハーネスのオブジェクトのイメージです\n※実際はもっと要素数が多いですが分かりやすく製品品番も1点としてシンプルにしています\n配列では無くオブジェクト指向にする事で柔軟性が向上します",
        type: "file",
      },
      {
        name: "products",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "count",
            type: "file",
            popOver: "製品品番の点数\n値:1\n型:Integer",
            isOpen: false,
          },
          {
            name: "item 1",
            type: "folder",
            isOpen: true,
            popOver: "製品品番の1点目\n型:productクラス",
            children: [
              {
                name: "name",
                type: "file",
                popOver: "製品品番\n値:82111A123     \n型:String",
              },
              {
                name: "RLTFA_designNum",
                type: "file",
                popOver: "設変\n値:C00\n型:String",
              },
              {
                name: "nickName",
                type: "file",
                popOver: "呼称\n値:123\n型:String",
              },
              {
                name: "cavTotalCount",
                type: "file",
                popOver: "cavの合計数\n値:1042\n型:Integer",
              },
              {
                name: "insertAfterCount",
                type: "file",
                popOver: "後ハメ数の合計\n値:162\n型:Integer",
              },
              {
                name: "terminals",
                type: "folder",
                isOpen: false,
                popOver: "コネクタ端末\n型:collection",
                children: [
                  {
                    name: "picturePath",
                    type: "file",
                    popOver:
                      "コネクタ写真のアドレス\n値:G:¥18_部材一覧¥201_写真¥7283-1018-40_1_001.png\n型:String",
                  },
                  {
                    name: "number",
                    type: "file",
                    popOver: "端末No\n値:6\n型:String",
                  },
                  {
                    name: "subNumber",
                    type: "file",
                    popOver: "サブNo\n値:GK4\n型:String",
                  },
                  {
                    name: "Item 1",
                    type: "folder",
                    isOpen: false,
                    popOver: "1つ目の端末\n型:terminalクラス",
                    children: [
                      {
                        name: "Holes",
                        type: "folder",
                        isOpen: false,
                        popOver: "端末の穴\n型:collection",
                        children: [
                          {
                            name: "Item 1",
                            type: "folder",
                            isOpen: false,
                            children: [
                              {
                                name: "shapeType",
                                type: "file",
                                popOver: "穴の形状\n値:Cir\n型:String",
                              },
                              {
                                name: "point",
                                type: "file",
                                popOver:
                                  "導通検査のポイントナンバー\n値:1014\n型:String",
                              },
                              {
                                name: "xLeft",
                                type: "file",
                                popOver:
                                  "コネクタ写真に対しての穴の左位置\n値:77\n型:String",
                              },
                              {
                                name: "wires",
                                type: "folder",
                                isOpen: false,
                                popOver: "電線\n型:collection",
                                children: [
                                  {
                                    name: "Item 1",
                                    type: "folder",
                                    isOpen: false,
                                    children: [
                                      {
                                        name: "color",
                                        type: "file",
                                        popOver:
                                          "電線の色番号\n値:70\n型:String",
                                      },
                                      {
                                        name: "colorCode",
                                        type: "file",
                                        popOver:
                                          "電線の色呼称\n値:Y\n型:String",
                                      },
                                      {
                                        name: "wireSize",
                                        type: "file",
                                        popOver:
                                          "電線のサイズ呼称\n値:039\n型:String",
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true}>
        <div
          className={styles.me}
          style={{ fontFamily: "Noto Sans JP", whiteSpace: "pre-line" }}
        >
          <Box textAlign="center" mb={8}>
            <Text fontSize="xl" colorScheme="black">
              プログラムの構造
            </Text>
            <Badge variant="solid" colorScheme="red" mr={2}>
              開発者
            </Badge>
          </Box>
          <FileSystemNode item={directoryData1} />
          <FileSystemNode item={directoryData2} />
        </div>
      </Content>
    </>
  );
}
