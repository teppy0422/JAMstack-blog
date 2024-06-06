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
            その後
            <span>
              <Kbd>Shift</Kbd>
            </span>
            を押しながら[このVerのアップロード]をクリックします
            <br />
            以上で全ての生産準備+から更新が可能になります
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={5}>
          <CustomLinkBox
            dateTime="2024-06-06T00:25:00+0900"
            description="1.竿レイアウトに関する処理を書き直し<br/>
            2.座標登録がなくてもハメ図を作成出来るように修正<br/>
            3.WEBサーバーへの接続を追加"
            linkHref="/files/Sjp3.004.78_.zip"
            inCharge="高知,徳島,不具合,王さん"
            isLatest={true}
          />
          <CustomLinkBox
            dateTime="2024-05-26T10:02:00+0900"
            description="1.収縮チューブの情報が無い場合Color:Wとする処理を追加<br/>
            2.Menuのハメ図の画像を再作成."
            linkHref="/files/Sjp3.004.68_.zip"
            inCharge="不具合"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-05-26T00:32:00+0900"
            description="登録済みのコネクタ数を西暦別にカウントに変更"
            linkHref="/files/Sjp3.004.67_.zip"
            inCharge="web"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-05-24T19:12:00+0900"
            description="WEBサイトに登録済みコネクタ数の表示を追加"
            linkHref="/files/Sjp3.004.66_.zip"
            inCharge="web"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-05-21T14:21:00+0900"
            description="プロシージャ:参照設定の確認をコメントアウト"
            linkHref="/files/Sjp3.004.65_.zip"
            inCharge="高知,不具合"
            isLatest={false}
          />
          <CustomLinkBox
            dateTime="2024-05-20T15:55:00+0900"
            description="空表示を先ハメ表示のみを別途選択できるように変更"
            linkHref="/files/Sjp3.004.63_.zip"
            inCharge="徳島,秋山さん"
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
