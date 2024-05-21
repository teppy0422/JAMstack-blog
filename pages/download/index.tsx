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
            以下からバージョンを選んでください
            <br />
            通常は
            <Badge colorScheme="teal" margin={1}>
              {" "}
              LATEST
            </Badge>
            を選択
            <br />
            ダウンロードしたらファイルを開いてMenuのVerupからアップロードを実行
            <br />
            この時
            <span>
              <Kbd>Shift</Kbd>
            </span>
            を押しながら[このVerのアップロード]をクリックします
            <br />
            その後は全ての生産準備+からそのバージョンへの更新が可能になります
          </Text>
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={10}>
          <CustomLinkBox
            dateTime="2024-05-21T14:21:00+0900"
            description="プロシージャ:参照設定の確認をコメントアウト"
            linkHref="/files/Sjp3.004.65_.zip"
            inCharge="不具合"
            isLatest={true}
          />
          <CustomLinkBox
            dateTime="2024-05-20T15:55:00+0900"
            description="空表示を先ハメ表示のみを別途選択できるように変更"
            linkHref="/files/Sjp3.004.63_.zip"
            inCharge="秋山さん"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-05-16T15:16:00+0900"
            description="MenuからWEBサイトにアクセスするアドレスの修正"
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
