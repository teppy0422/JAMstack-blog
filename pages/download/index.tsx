import React from "react";
import Content from "../../components/content";
import Link from "next/link";
import { Button, Input } from "@chakra-ui/react";

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
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import NextImage from "next/image";
import styles from "../../styles/home.module.scss";

import Hippo_001_wrap from "../../components/3d/hippo_001_wrap";
import Alagin_wrap from "../../components/3d/alagin_wrap";
import Table_wrap from "../../components/3d/table_wrap";
import Speaker_wrap from "../../components/3d/speaker_wrap";
import Sushi_ebi_wrap from "../../components/3d/sushi_ebi_wrap";
import Sushi_ika_wrap from "../../components/3d/sushi_ika_wrap";
import Sushi_ootoro_wrap from "../../components/3d/sushi_ootoro_wrap";
import Sushi_tamago_wrap from "../../components/3d/sushi_tamago_wrap";
import Sushi_ikura_wrap from "../../components/3d/sushi_ikura_wrap";

function DrawerExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  return (
    <>
      <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
        Open
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default function About() {
  const illusts = [
    { src: "/images/illust/hippo/hippo_001.png" },
    { src: "/images/illust/hippo/hippo_001_a.png" },
  ];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  return (
    <Content>
      <div className={styles.me}>
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
          <Hippo_001_wrap />
          <Alagin_wrap />
          <Table_wrap />
          <Speaker_wrap />
          <Sushi_ebi_wrap />
          <Sushi_ika_wrap />
          <Sushi_ootoro_wrap />
          <Sushi_tamago_wrap />
          <Sushi_ikura_wrap />
        </Box>
        <Box mt={10} textAlign="center">
          <Link href="/files/downloadTxt.txt" passHref>
            <a download="downloadTxt.txt">こちらからダウンロードaaa</a>
          </Link>
          <Link
            href="/files/Sjp3.004.62_464D_82161-6BN31㈹aテスト.zip"
            passHref
          >
            <a download="Sjp3.004.62_464D_82161-6BN31㈹aテスト.zip">
              こちらからダウンロードaaa
            </a>
          </Link>
        </Box>
        <DrawerExample />
      </div>
    </Content>
  );
}
