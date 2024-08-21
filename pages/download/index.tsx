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

  return (
    <Content isCustomHeader={true}>
      <div className={styles.me} style={{ paddingTop: "50px" }}>
        <Box textAlign="center" mb={8}>
          <Text fontSize="lg" colorScheme="black">
            以下からバージョンを選んでクリックしてください
            <br />
            通常は
            <Badge colorScheme="teal" margin={1}>
              LATEST
            </Badge>
            を選択します
            <br /> <br />
            ダウンロードしたらファイルを開いてMenuのVerupからアップロードを実行
            <br />
            <span>
              <Kbd>Shift</Kbd>
            </span>
            を押しながら[このVerのアップロード]をクリックします
            <br />
            以上で全ての生産準備+からVerupが可能になります
            <br />
            <br />
            このページは現在調整中です
            <br />
            不具合報告にご協力をお願いします
          </Text>
        </Box>

        <SimpleGrid
          columns={{ base: 1, md: 1, lg: 1, xl: 1 }}
          spacing={5}
          mx={{ base: 2, md: 20, lg: 40, xl: 50 }}
        >
          <CustomLinkBox
            dateTime="2024-08-21T15:49:00+0900"
            description1="製品品番のデータ参照がRange型で扱い辛く修正に問題がある"
            description2="製品品番をRange型からclass型に変更。検査履歴システムの作成をグループで出来るように変更"
            descriptionIN="検査履歴システム用点滅画像の修正。作成時にグループでまとめて作成に対応"
            linkHref="/files/Sjp3.005.13_.zip"
            inCharge="不具合,書き直し,高知,win10zip"
            isLatest={true}
          />
          <CustomLinkBox
            dateTime="2024-08-04T10:50:00+0900"
            description1="部品リストの防水栓に端末Noを入力するのが手間"
            description2="部品リストに防水栓の端末No入力が全て0の場合はCAV一覧からサブNo.を取得"
            descriptionIN=""
            linkHref="/files/Sjp3.004.97_.zip"
            inCharge="不具合,高知,王さん,win10zip"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-07-22T10:50:00+0900"
            description1="部品リストの防水栓に端末Noを入力するのが手間"
            description2="部品リストに防水栓の端末No入力が全て0の場合はCAV一覧から取得"
            descriptionIN=""
            linkHref="/files/Sjp3.004.96_.zip"
            inCharge="不具合,高知,王さん,win10zip"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-07-18T17:34:00+0900"
            description1="ダブり圧着で先ハメの時に片方しか赤枠にならない"
            description2="複数電線でも赤枠になるように修正"
            descriptionIN=""
            linkHref="/files/Sjp3.004.94_.zip"
            inCharge="不具合,高知,王さん,win10zip"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-07-18T14:20:00+0900"
            description1="検査履歴システムで先ハメ/後ハメが分かるようにしたい"
            description2="検査履歴用の画像で共用ポイントを点滅するように修正"
            descriptionIN=""
            linkHref="/files/Sjp3.004.93_.zip"
            inCharge="更新,高知,王さん,win10zip"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-06-26T10:46:00+0900"
            description1="配索誘導の画像を出力できない"
            description2="sleepMax_を5倍に修正"
            descriptionIN=""
            linkHref="/files/Sjp3.004.85_.zip"
            inCharge="不具合,高知,王さん,win10zip"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-06-24T11:01:00+0900"
            description1="配索誘導の画像を出力できない"
            description2="CPUの速度に応じてsleep時間を長くするように変更"
            descriptionIN=""
            linkHref="/files/Sjp3.004.84_.zip"
            inCharge="不具合,高知,王さん,win10zip"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-06-11T12:24:00+0900"
            description1="高知のPC設定が徳島と異なるためサーバー接続が出来ない"
            description2="サーバーへの接続タイミングを修正"
            descriptionIN=""
            linkHref="/files/Sjp3.004.83_.zip"
            inCharge="不具合,高知,王さん,win10のzip圧縮"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-06-10T11:04:00+0900"
            description1=""
            description2="空のフォントサイズを9に変更"
            descriptionIN=""
            linkHref="/files/Sjp3.004.82_.zip"
            inCharge="徳島,秋山さん,win10でzip"
            isLatest={false}
          />
        </SimpleGrid>

        <Box style={{ textAlign: "center" }}>
          {illusts.map((item, index) => {
            const aosOffset: number = (index % 2) * 150;
            const aosDuration = (index % 4) * 700;
            const aosDelay = (index % 4) * 300;
            return (
              <div
                data-aos="flip-left"
                data-aos-offset={aosOffset}
                data-aos-duration={aosDuration}
                data-aos-delay={aosDelay}
                style={{ display: "inline-block" }}
              >
                <Image
                  src={item.src}
                  style={{ display: "inline-block" }}
                  m={3}
                  className={styles.purupuru}
                />
              </div>
            );
          })}
          <Hippo_001_wrap />
        </Box>
      </div>
    </Content>
  );
}
