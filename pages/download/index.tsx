import React from "react";
import Content from "../../components/content";
import Link from "next/link";
import { Image, Text, Box, SimpleGrid, Badge, Kbd } from "@chakra-ui/react";
import { MdSettings, MdCheckCircle } from "react-icons/md";
import NextImage from "next/image";
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
              {" "}
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
          </Text>
        </Box>

        <SimpleGrid
          columns={{ base: 1, md: 1, lg: 1, xl: 1 }}
          spacing={5}
          mx={{ base: 2, md: 20, lg: 40, xl: 50 }}
        >
          <CustomLinkBox
            dateTime="2024-06-11T12:24:00+0900"
            description1="高知のPC設定が徳島と異なるためサーバー接続が出来ない"
            description2="サーバーへの接続タイミングを修正"
            descriptionIN=""
            linkHref="/files/Sjp3.004.83_.xlsm"
            inCharge="不具合,高知,王さん,圧縮無し"
            isLatest={true}
            isFileExist={true}
          />
          <CustomLinkBox
            dateTime="2024-06-11T12:24:00+0900"
            description1="高知のPC設定が徳島と異なるためサーバー接続が出来ない"
            description2="サーバーへの接続タイミングを修正"
            descriptionIN=""
            linkHref="/files/Sjp3.004.83_.zip"
            inCharge="不具合,高知,王さん,win10のzip圧縮"
            isLatest={true}
            isFileExist={true}
          />
          <CustomLinkBox
            dateTime="2024-06-11T12:24:00+0900"
            description1="高知のPC設定が徳島と異なるためサーバー接続が出来ない"
            description2="サーバーへの接続タイミングを修正"
            descriptionIN=""
            linkHref="/files/Sjp3.004.83__.zip"
            inCharge="不具合,高知,王さん,win10の7zip無圧縮"
            isLatest={true}
            isFileExist={true}
          />

          <CustomLinkBox
            dateTime="2024-06-10T15:39:00+0900"
            description1=""
            description2="空のフォントサイズを9に変更"
            descriptionIN="空のフォントサイズを9に変更"
            linkHref="/files/Sjp3.004.82_.xlsm"
            inCharge="徳島,秋山さん,圧縮しない"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-06-10T15:27:00+0900"
            description1=""
            description2="空のフォントサイズを9に変更"
            descriptionIN="空のフォントサイズを9に変更"
            linkHref="/files/Sjp3.004.82__.zip"
            inCharge="徳島,秋山さん,7zipでzip"
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
          <CustomLinkBox
            dateTime="2024-06-08T14:28:00+0900"
            description1=""
            description2="後引張支援システムでRLTFが大きい場合に対応"
            linkHref="/files/Sjp3.004.81_.zip"
            inCharge="高知,王さん"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-06-07T09:25:00+0900"
            description1="シートイベントが発生しない時があることの修正"
            description2="Menuでイベントのリセットを追加"
            linkHref="/files/Sjp3.004.80_.zip"
            inCharge="高知,徳島,不具合,王さん"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-05-16T15:16:00+0900"
            description1="MenuからWEBサイトにアクセス出来ない"
            description2="アドレスの修正"
            linkHref="/files/Sjp3.004.62_.zip"
            inCharge="不具合"
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
