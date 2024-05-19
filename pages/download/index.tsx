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
    <Content>
      <div className={styles.me}>
        <VStack>
          <Flex>
            <Box mr={3}>
              <Box className={styles.watercolor} h={100}>
                <Text p={6} fontSize="32px" fontWeight="700">
                  ダウンロード
                </Text>
              </Box>
              <Text className={styles.tool} pl={5}>
                by InkScape
              </Text>
            </Box>
            <Spacer />
            <Box filter="auto" brightness="110%">
              <NextImage
                className={styles.pic}
                src="/images/illust/hippo/hippo_001_cir.png"
                alt="me.jpeg"
                objectFit="cover"
                width={92}
                height={92}
              />
            </Box>
          </Flex>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={10}>
          <CustomLinkBox
            dateTime="2024-05-19T14:30:00+0900"
            description="先ハメのみでも空詮表示をする"
            linkHref="/files/Sjp3.004.63_.xlsm"
            ver="3.004.63"
          />
          <CustomLinkBox
            dateTime="2024-05-18T02:21:00+0900"
            description="MenuからWEBサイトにアクセスするアドレスの修正"
            linkHref="/files/Sjp3.004.62_.xlsm"
            ver="3.004.62"
          />
          <CustomLinkBox
            dateTime="2024-05-16T02:21:00+0900"
            description="MenuからWEBサイトにアクセスするアドレスの修正"
            linkHref="/files/Sjp3.004.61_.xlsm"
            ver="3.004.61"
          />
        </SimpleGrid>

        <Box ml={[0, 18, 70, 115]}>
          <div data-aos="fade-right" style={{ display: "inline-block" }}>
            <Text className={styles.subTitle}>サンプル</Text>
          </div>
        </Box>
        {/* <Sample3d /> */}

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
