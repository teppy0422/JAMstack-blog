import React from "react";
import {
  Box,
  Text,
  Avatar,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useColorMode,
  Divider,
  Icon,
  Grid,
  List,
  SimpleGrid,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import QRCode from "qrcode.react";

import { AiOutlineWechat } from "react-icons/ai";
import { FaStarOfLife } from "react-icons/fa";
import { CiBeerMugFull } from "react-icons/ci";
import { IoMdPhonePortrait, IoMdMail } from "react-icons/io";
import { MdWeb } from "react-icons/md";

import getMessage from "./getMessage";
import { useLanguage } from "../context/LanguageContext";
import SkillGraph from "../components/sillGraph";
import SkillCircle from "../components/skillCircle";
import ICT from "../pages/skillBlogs/ICT";
import styles from "../styles/home.module.scss";

const BusinessCard: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { language, setLanguage } = useLanguage();
  const { colorMode, toggleColorMode } = useColorMode();

  const skillCircles = [
    {
      value: 90,
      cirText: "EXCEL-vba\n15年",
      color: "#1f9b60",
      img: "/images/brandIcons/logo_excel.svg",
    },
    {
      value: 65,
      cirText: "ACCESS-vba\n3年",
      color: "#1f9b60",
      img: "/images/brandIcons/logo_access.svg",
    },
    {
      value: 30,
      cirText: "vb.net\n半年",
      color: "#9A4F96",
      img: "/images/brandIcons/logo_dotNet.svg",
    },
    {
      value: 60,
      cirText: "HTML\n4年",
      color: "#F1652A",
      img: "/images/brandIcons/logo_html5.svg",
    },
    {
      value: 65,
      cirText: "CSS\n+SCSS\n4年",
      color: "#F1652A",
      img: "/images/brandIcons/logo_css.svg",
    },
    {
      value: 40,
      cirText: "JavaScript\n4年",
      color: "#F1652A",
      img: "/images/brandIcons/logo_javascript.svg",
    },
    {
      value: 45,
      cirText: "Next\n3年",
      color: "#F1652A",
      img: "/images/brandIcons/logo_next.svg",
    },
    {
      value: 30,
      cirText: "PHP\n半年",
      color: "#4E5B92",
      img: "/images/brandIcons/logo_php.svg",
    },
    {
      value: 20,
      cirText: "Python",
      color: "#4E5B92",
      img: "/images/brandIcons/logo_python.svg",
    },
    {
      value: 60,
      cirText: "Arduino",
      color: "#12999F",
      img: "/images/brandIcons/logo_arduino.svg",
    },
    {
      value: 30,
      cirText: "Davinci Resolve",
      color: "#888888",
      img: "/images/brandIcons/logo_davinci.svg",
    },
    {
      value: 30,
      cirText: "InkScape\n1年",
      color: "#333333",
      img: "/images/brandIcons/logo_inkscape.svg",
    },
    {
      value: 30,
      cirText: "Premiere Pro",
      color: "#00005c",
      img: "/images/brandIcons/logo_Premiere.svg",
    },
  ];
  return (
    <>
      <SimpleGrid
        columns={{ base: 1, sm: 1, md: 2, lg: 1, xl: 2 }}
        spacing={2}
        // justifyContent="center"
      >
        <Box
          width="316px"
          height="180px"
          borderWidth="1px"
          bgImage="url('/images/common/paperf7f7f7.png')" // 画像のパスを指定
          filter="brightness(1.05)"
          bgSize="cover"
          overflow="hidden"
          boxShadow="lg"
          p={4}
          cursor="pointer"
          onClick={onOpen}
          _hover={{ boxShadow: "xl" }} // ホバー時に影を強調
          position="relative" // 親要素を相対位置に設定
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            width="50px"
            height="50px"
            backgroundImage="
            linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999),
            linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999)"
            backgroundSize="20px 20px"
            backgroundPosition="0 0, 10px 10px"
            clipPath="polygon(0 0, 100% 0, 0 100%)"
          />
          <Box
            position="absolute"
            bottom="0"
            right="0"
            width="50px"
            height="50px"
            backgroundImage="
            linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999),
            linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999)"
            backgroundSize="20px 20px"
            backgroundPosition="0 0, 10px 10px" // 市松模様の位置を調整
            clipPath="polygon(100% 100%, 0 100%, 100% 0)" // 逆向きの三角形の形状を指定
          />
          <Flex align="center">
            <Box ml={5}>
              <Text fontWeight="bold" fontSize="sm" mt={0} color="#000">
                STUDIO+
              </Text>
              <Text fontSize="lg" color="black" mt={3}>
                {getMessage({
                  ja: "片岡 哲兵",
                  us: "\u00A0",
                  cn: "\u00A0",
                  language,
                })}
              </Text>
              <Text fontSize="sm" color="black">
                Kataoka Teppei
              </Text>
              <Divider borderColor="black" my={2} />
              <Flex align="flex-start" mt={3}>
                <AiOutlineWechat
                  size={16}
                  style={{ marginRight: "4px", marginTop: "2px" }}
                  color="#999"
                />
                <Text fontSize="xs" color="black">
                  {getMessage({
                    ja: "徳島県藍住町\n奥野和田135-35",
                    us: "Tokushima Aizumi-cho OkunoWada135-35",
                    cn: "徳島県藍住町奥野和田135-35",
                    language,
                  })}
                </Text>
              </Flex>
            </Box>
            <Avatar
              boxSize="64px"
              ml={8}
              name="John Doe"
              src="/images/me.jpeg"
              mr={4}
              filter="grayscale(10%)"
            />
          </Flex>
        </Box>

        <Box
          width="316px"
          height="180px"
          borderWidth="1px"
          overflow="hidden"
          boxShadow="lg"
          p={0}
          bgImage="url('/images/common/paperf7f7f7.png')"
          filter="brightness(1.05)"
          bgSize="cover"
          cursor="pointer"
          onClick={onOpen}
          _hover={{ boxShadow: "xl" }} // ホバー時に影を強調
          position="relative" // 親要素を相対位置に設定
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            width="50px"
            height="50px"
            backgroundImage="
            linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999),
            linear-gradient(45deg, #999 25%, transparent 25%, transparent 75%, #999 75%, #999)"
            backgroundSize="20px 20px"
            backgroundPosition="0 0, 10px 10px"
            clipPath="polygon(0 0, 100% 0, 0 100%)"
          />
          <Box p={4} alignContent="center" justifyItems="center" height="60%">
            <Text fontWeight="bold" fontSize="md" mt={0} color="#000">
              OUR SERVICES
            </Text>
            <List spacing={0} mt={1}>
              <ListItem>
                <ListIcon
                  as={FaStarOfLife}
                  color="#999"
                  fontSize={11}
                  position="relative"
                  top="-4px"
                  mr={1.5}
                />
                <Text as="span" fontSize="xs" color="black">
                  {getMessage({
                    ja: "ワイヤーハーネス歴20年の知識",
                    us: "20 years of wiring harness knowledge.",
                    cn: "20 年的线束知识",
                    language,
                  })}
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon
                  as={FaStarOfLife}
                  color="#999"
                  fontSize={11}
                  position="relative"
                  top="-4px"
                  mr={1.5}
                />
                <Text as="span" fontSize="xs" color="black">
                  {getMessage({
                    ja: "プログラム言語はだいたい対応可能",
                    us: "Most programming languages are supported.",
                    cn: "支持大多数编程语言",
                    language,
                  })}
                </Text>
              </ListItem>
            </List>
          </Box>

          <Box
            width="100%"
            height="41%"
            bgImage="url('/images/common/paper181d26.png')"
            filter="brightness(1.2)"
            bgSize="cover"
            color="#FFF"
            fontSize="11px"
            textAlign="center"
            m={0}
            p={0}
          >
            <Flex>
              <Box ml="46px" mt={2} p={1} pt={0} bg="#FFF" color="#000">
                LINE
                <QRCode value="https://line.me/ti/p/gtbexsxqus" size={38} />
              </Box>
              <Box ml="20px" pt={1.5}>
                <Flex align="flex-start" my={0.5}>
                  <IoMdPhonePortrait
                    size={14}
                    style={{ marginRight: "4px", marginTop: "2px" }}
                    color="#FFF"
                  />
                  <Text color="#FFF">
                    {getMessage({
                      ja: "090-8971-4946",
                      us: "(+81)090-8971-4946",
                      cn: "(+81)090-8971-4946",
                      language,
                    })}
                  </Text>
                </Flex>
                <Flex align="flex-start" my={0.5}>
                  <IoMdMail
                    size={14}
                    style={{ marginRight: "4px", marginTop: "1px" }}
                    color="#FFF"
                  />
                  <Text color="#FFF">teppy422@au.com</Text>
                </Flex>
                <Flex align="flex-start" my={0.5}>
                  <MdWeb
                    size={14}
                    style={{ marginRight: "4px", marginTop: "1px" }}
                    color="#FFF"
                  />
                  <Text color="#FFF">https://teppy.link</Text>
                </Flex>
              </Box>
              {/* <Grid templateColumns="repeat(3, 1fr)" gap={0} mt={4} ml={12}>
                <Box
                  width="14px"
                  height="10px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  borderLeftWidth="2px"
                  borderTopWidth="2px"
                  borderColor="#FFF"
                />
                <Box
                  width="14px"
                  height="10px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                />
                <Box
                  width="14px"
                  height="10px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderTopWidth="2px"
                  borderRightWidth="2px"
                  borderColor="#FFF"
                />

                <Box
                  width="14px"
                  height="10px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                />
                <Box
                  width="14px"
                  height="10px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                />
                <Box
                  width="14px"
                  height="10px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                />
                <Box
                  width="14px"
                  height="10px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderLeftWidth="2px"
                  borderBottomWidth="2px"
                  borderColor="#FFF"
                />
                <Box
                  width="14px"
                  height="10px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                />
                <Box
                  width="14px"
                  height="10px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderBottomWidth="2px"
                  borderRightWidth="2px"
                  borderColor="#FFF"
                />
              </Grid> */}
              <Box ml={4} mt={2} p={1} pt={0} bg="#FFF" color="#000">
                WEB
                <QRCode value="https://teppy.link" size={38} />
              </Box>
            </Flex>
          </Box>
        </Box>
      </SimpleGrid>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          maxWidth={["90%", "80%", "70%", "60%"]}
          bg={colorMode === "light" ? "#f2e9df" : "#000"}
          zIndex="100000"
        >
          <ModalHeader color={colorMode === "light" ? "#000" : "#FFF"}>
            片岡 哲兵
          </ModalHeader>
          <ModalCloseButton
            _focus={{ boxShadow: "none" }}
            color={colorMode === "light" ? "#FFF" : "#000"}
          />
          <ModalBody>
            <Flex alignItems="flex-start" mb={4} justifyContent="center">
              <Avatar src="/images/me.jpeg" width={8} height={8} m={2} />
              <Text
                w={["100%", "95%", "90%", "90%"]}
                mb={20}
                ml={0}
                color={colorMode === "light" ? "#000" : "#FFF"}
              >
                {getMessage({
                  ja:
                    "高知出身。ワイヤーハーネス製造工場で/機械保全/前工程生産分析/後工程生産分析/工務/工作改善チームを経験。" +
                    "工作改善チームではPLC/Arduinoなどのハードウェアを経験させてもらいました。" +
                    "その後、ハードウェアとソフトウェアを組み合わせる内にHTML/JavaScriptを経験してWEBアプリを作るに至りました。" +
                    "現場の人と相談しながら更に発展させていくのが得意。プログラミングは嫌い。",
                  us: "Born in Kochi. Experienced in wire harness manufacturing plant / machine maintenance / front-end production analysis / back-end production analysis / engineering work / machine improvement team. The Craft Improvement Team gave me experience with PLC/Arduino and other hardware. Later, while combining hardware and software, I experienced HTML/JavaScript and went on to create web applications. He is good at consulting with people in the field to further develop the project. I hate programming.",
                  cn: "生于高知。在一家线束制造厂担任经验丰富的/机器维护/前端生产分析/后端生产分析/工程/机器改进小组的工作。工艺改进小组为我提供了使用 PLC/Arduino 等硬件的经验。后来，在结合硬件和软件的过程中，他体验了 HTML/JavaScript 并继续创建了一个网络应用程序。他善于与当地人协商，以进一步发展项目。我不喜欢编程。",
                  language,
                })}
              </Text>
            </Flex>
            <div data-aos="fade-right" style={{ display: "inline-block" }}>
              <Text
                className={styles.subTitle}
                color={colorMode === "light" ? "#000" : "#FFF"}
              >
                {getMessage({
                  ja: "スキル",
                  us: "skills",
                  cn: "技能",
                  language,
                })}
              </Text>
            </div>
            <Flex justifyContent="center">
              <SkillGraph />
            </Flex>

            <Box style={{ textAlign: "center" }} mb={20}>
              {skillCircles.map((item, index) => {
                const aosOffset: number = (index % 5) * 70;
                return (
                  <Flex
                    key={index}
                    data-aos="fade-up"
                    data-aos-offset={aosOffset}
                    style={{ display: "inline-block" }}
                  >
                    <SkillCircle
                      value={item.value}
                      cirText={item.cirText}
                      color={item.color}
                      timing={index}
                      img={item.img}
                    />
                  </Flex>
                );
              })}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="gray"
              mr={1}
              border="1px solid gray"
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BusinessCard;
