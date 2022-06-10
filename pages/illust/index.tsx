import React from "react";
import Content from "../../components/content";

import {
  Center,
  Image,
  Text,
  VStack,
  Box,
  Tooltip,
  Flex,
  Spacer,
  CircularProgress,
  CircularProgressLabel,
  Wrap,
  WrapItem,
  HStack,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import NextImage from "next/image";
import styles from "../../styles/home.module.scss";

import Hippo_001_wrap from "../../components/3d/hippo_001_wrap";

export default function About() {
  const illusts = [
    {
      src: "/images/illust/hippo/hippo_001.png",
    },
    {
      src: "/images/illust/hippo/hippo_001_a.png",
    },
    {
      src: "/images/illust/hippo/hippo_002.png",
    },
    {
      src: "/images/illust/hippo/hippo_004.png",
    },
    {
      src: "/images/illust/hippo/hippo_005.png",
    },
    {
      src: "/images/illust/hippo/hippo_005_a.png",
    },
    {
      src: "/images/illust/hippo/hippo_006.png",
    },
    {
      src: "/images/illust/hippo/hippo_007.png",
    },
    {
      src: "/images/illust/hippo/hippo_008.png",
    },
    {
      src: "/images/illust/hippo/hippo_010.png",
    },
    {
      src: "/images/illust/hippo/hippo_011.png",
    },
    {
      src: "/images/illust/hippo/hippo_011_a.png",
    },
    {
      src: "/images/illust/hippo/hippo_012.png",
    },
    {
      src: "/images/illust/hippo/hippo_013.png",
    },
    {
      src: "/images/illust/hippo/hippo_014.png",
    },
    {
      src: "/images/illust/hippo/hippo_015.png",
    },
    {
      src: "/images/illust/hippo/hippo_016.png",
    },
    {
      src: "/images/illust/hippo/hippo_017.png",
    },
    {
      src: "/images/illust/hippo/hippo_017_a.png",
    },
    {
      src: "/images/illust/hippo/hippo_019.png",
    },
    {
      src: "/images/illust/hippo/hippo_020.png",
    },
    {
      src: "/images/illust/hippo/hippo_021.png",
    },
    {
      src: "/images/illust/hippo/hippo_022.png",
    },
    {
      src: "/images/illust/obj/obj_001.png",
    },
    {
      src: "/images/illust/obj/obj_002.png",
    },
    {
      src: "/images/illust/obj/obj_003.png",
    },
    {
      src: "/images/illust/obj/obj_004.png",
    },
  ];
  return (
    <Content>
      <div className={styles.me}>
        <Text>-作成中-</Text>
        <VStack>
          <Flex>
            <Box mr={3}>
              <Box className={styles.watercolor} h={100}>
                <Text p={5} fontSize="32px" fontWeight="700">
                  イラスト
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
        </Box>
        <Hippo_001_wrap />
      </div>
    </Content>
  );
}
