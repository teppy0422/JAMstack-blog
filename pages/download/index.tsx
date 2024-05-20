import React from "react";
import Content from "../../components/content";
import Link from "next/link";
import {
  Image,
  Text,
  VStack,
  Box,
  Flex,
  Spacer,
  useDisclosure,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
} from "@chakra-ui/react";
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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={10}>
          <CustomLinkBox
            dateTime="2024-05-20T15:55:00+0900"
            description="空表示を先ハメ表示のみを別途選択できるように変更.OSでzip圧縮"
            linkHref="/files/Sjp3.004.63_.zip"
            ver="3.004.63"
            inCharge="秋山さん"
          />
          <CustomLinkBox
            dateTime="2024-05-16T15:16:00+0900"
            description="MenuからWEBサイトにアクセスするアドレスの修正.7zipでzip圧縮"
            linkHref="/files/Sjp3.004.62_.zip"
            ver="3.004.62"
            inCharge="不具合"
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
