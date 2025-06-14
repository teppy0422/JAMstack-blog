"use client";

import React, { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Link,
  List,
  ListItem,
  Divider,
  ChakraProvider,
  extendTheme,
  IconButton,
  Badge,
  Avatar,
  Code,
  Image,
  Kbd,
  AvatarGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Icon,
  createIcon,
  Spacer,
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import {
  FaFile,
  FaRegEdit,
  FaFolder,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import { PiAppWindowFill, PiArrowFatLineDownLight } from "react-icons/pi";
import { LuPanelRightOpen } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import Content from "@/components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "@/components/ui/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "@/components/ui/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "@/components/ui/CustomBadge";
import DownloadLink from "../../components/DownloadLink";
import ExternalLink from "../../components/ExternalLink";
import { FileSystemNode } from "@/components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import ImageSliderModal from "../../components/ImageSliderModal"; // モーダルコンポーネントをインポート
import ReferenceSettingModal from "../../../../src/components/howto/office/referenceSettingModal";
import { useUserContext } from "@/contexts/useUserContext";
import { supabase } from "@/utils/supabase/client";

import { BsFiletypeExe } from "react-icons/bs";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

const CustomIcon = createIcon({
  displayName: "CustomIcon",
  viewBox: "0 0 26 26",
  path: (
    <path
      d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
});
const BlogPage: React.FC = () => {
  const { currentUserId } = useUserContext();
  const { language, setLanguage } = useLanguage();
  //右リストの読み込みをlanguage取得後にする
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);
  useEffect(() => {
    if (language) {
      setIsLanguageLoaded(true);
    }
  }, [language]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const sections = useRef<{ id: string; title: string }[]>([]);
  const { colorMode } = useColorMode();
  const [showConfetti, setShowConfetti] = useState(false); // useStateをコンポーネント内に移動
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // onOpenを追加
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const showToast = useCustomToast();

  //右リストの読み込みをlanguage取得後にする
  if (!isLanguageLoaded) {
  }

  function RenderNode({ nodes, num }) {
    const parsedNodes = nodes.split(",").map((node) => {
      const [text, y, x, curve] = node.split("/");
      return [text, y, parseInt(x, 10), curve]; // xを数値に変換
    });

    let xx = [10];
    let notes: number[] = []; // notesの型を数値に設定
    let time: number = 0;

    return (
      <svg
        width="210"
        height="160"
        viewBox="0 0 210 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="40" x2="0" y2="100" stroke="black" strokeWidth="1" />
        <line
          x1="210"
          y1="40"
          x2="210"
          y2="100"
          stroke="black"
          strokeWidth="1"
        />
        <line x1="0" y1="40" x2="210" y2="40" stroke="black" strokeWidth="1" />
        <line x1="0" y1="60" x2="210" y2="60" stroke="black" strokeWidth="1" />
        <line x1="0" y1="80" x2="210" y2="80" stroke="black" strokeWidth="1" />
        <line
          x1="0"
          y1="100"
          x2="210"
          y2="100"
          stroke="black"
          strokeWidth="1"
        />
        <defs>
          <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="1"
              floodColor="white"
              floodOpacity="1"
            />
          </filter>
        </defs>
        {parsedNodes.map((node, index) => {
          const [text, y, note, curve] = node;
          let yy = 0;
          if (y === "4") {
            yy = 45;
          } else if (y === "3") {
            yy = 65;
          } else if (y === "2") {
            yy = 85;
          } else if (y === "1") {
            yy = 105;
          }
          // 現在のxxを取得
          const currentX = xx[index];

          // 次のxxを計算して配列に追加
          let nextX = currentX;
          if (note === 16) {
            nextX += (1 / 16) * 200;
          } else if (note === 8) {
            nextX += (1 / 8) * 200;
          } else if (note === 4) {
            nextX += (1 / 4) * 200;
          } else if (note === 34) {
            nextX += (3 / 4) * 200;
          } else {
            nextX += 10; // デフォルトの増加
          }
          xx.push(nextX);

          notes.push(note);
          // console.log(xx);
          console.log("index", index);
          console.log(notes[index] === 8);
          console.log(notes[index]);

          time = time + 1 / note;
          console.log(time);
          console.log(Number.isInteger(time / 0.25));

          let maxY = yy + 30;
          if (maxY > 125) {
            maxY = 125;
          }
          return (
            <React.Fragment key={index}>
              <text
                key={index}
                x={0}
                y={35}
                fill="black"
                stroke="black"
                strokeWidth="0.5"
                fontSize="11px"
                filter="url(#textShadow)"
              >
                {num}
              </text>
              <text
                key={index}
                x={currentX}
                y={yy}
                fill="black"
                stroke="black"
                strokeWidth="1"
                filter="url(#textShadow)"
              >
                {text}
              </text>
              <line
                x1={currentX + 5}
                y1={yy + 5}
                x2={currentX + 5}
                y2={maxY}
                stroke="black"
                strokeWidth="1"
              />
              {note === 8 &&
                notes[index - 1] === 8 &&
                Number.isInteger(time / 0.25) && (
                  <line
                    x1={currentX + 5}
                    y1={maxY}
                    x2={xx[index - 1] + 5}
                    y2={maxY}
                    stroke="black"
                    strokeWidth="3"
                  />
                )}
              {curve === "d" && (
                <path
                  d={`M${currentX + 10} ${yy - 10} Q ${currentX + 15} ${
                    yy - 15
                  } ${currentX + 20} ${maxY}`}
                  stroke="black"
                  fill="transparent"
                  strokeWidth="1"
                />
              )}
            </React.Fragment>
          );
        })}
      </svg>
    );
  }

  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs}>
        <Box w="100%">
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <AvatarGroup size="sm" spacing={-1.5}>
              <Avatar
                src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
                borderWidth={1}
              />
            </AvatarGroup>
            <Text>@kataoka</Text>
            <Text>in</Text>
            <Text>
              {getMessage({
                ja: "開発",
                language,
              })}
            </Text>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            {getMessage({
              ja: "ベース楽譜",
              us: "Bass Scores",
              cn: "低音提琴乐谱",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "バンド",
              us: "band",
              cn: "带",
              language,
            })}
          />
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            {getMessage({
              ja: "更新日",
              language,
            })}
            :2024-12-07
          </Text>
        </Box>
        <SectionBox
          id="section1"
          title={
            "1." +
            getMessage({
              ja: "マリーゴールド",
              us: "marigold",
              cn: "万寿菊",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box display="flex" flexWrap="wrap" justifyContent="center">
            <RenderNode num="1" nodes="" />
            <RenderNode num="2" nodes="" />
            <RenderNode num="3" nodes="" />
            <RenderNode
              num="4"
              nodes="5/2/8,5/2/8,5/2/8,5/2/8,5/2/8,5/2/8,5/2/8,5/2/8"
            />
            <RenderNode
              num="5"
              nodes="4/2/8,4/2/8,4/2/8,4/2/8,4/2/8,4/2/8,5/2/8,4/2/8"
            />
            <RenderNode
              num="6"
              nodes="2/2/8,2/2/8,2/2/8,2/2/8,2/2/8,2/2/8,2/2/8,0/1/8"
            />
            <RenderNode
              num="7"
              nodes="2/1/4,〆/2/8,2/1/8,〆/2/8,2/1/8,2/1/4/d"
            />
            <RenderNode
              num="8"
              nodes="3/1/8,3/1/8,3/1/8,0/1/8,2/1/8,2/1/8,2/1/8,2/1/8"
            />
            <RenderNode
              num="9"
              nodes="3/1/8,3/1/8,3/1/8,3/1/8,5/1/8,5/1/8,2/2/8,4/2/8"
            />
            <RenderNode
              num="10"
              nodes="5/2/8,5/2/8,5/2/8,5/2/8,5/2/8,5/2/8,5/2/8,5/2/8"
            />
            <RenderNode
              num="11"
              nodes="4/2/8,4/2/8,4/2/8,4/2/8,4/2/8,4/2/8,5/2/8,4/2/8"
            />
            <RenderNode
              num="12"
              nodes="2/2/8,2/2/8,2/2/8,2/2/8,2/2/8,2/2/8,2/2/8,2/2/8"
            />
            <RenderNode
              num="13"
              nodes="5/1/8,5/1/8,5/1/8,5/1/8,5/1/8,5/1/8,0/1/8,2/1/8"
            />
            <RenderNode
              num="14"
              nodes="3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,0/1/8"
            />
            <RenderNode
              num="15"
              nodes="2/1/8,2/1/8,2/1/8,2/1/8,2/1/8,2/1/8,2/1/8,2/1/8"
            />
            <RenderNode
              num="16"
              nodes="3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,0/2/8,2/2/8"
            />
            <RenderNode
              num="17"
              nodes="0/2/8,0/2/8,0/2/8,0/2/8,0/2/8,7/2/8,7/3/8,7/2/8"
            />
            <RenderNode
              num="18"
              nodes="5/2/8,5/2/8,5/2/8,5/2/8,5/2/8,7/3/8,7/3/8,5/2/8"
            />
            <RenderNode
              num="19"
              nodes="4/2/8,4/2/8,4/2/8,4/2/8,4/2/8,4/2/8,0/2/8,0/2/8"
            />
            <RenderNode
              num="20"
              nodes="2/2/8,2/2/8,2/2/8,2/2/8,2/2/8,2/2/8,2/2/8,2/2/8"
            />
            <RenderNode
              num="21"
              nodes="5/1/8,5/1/8,5/1/8,5/1/8,5/1/8,5/1/8,0/1/8,2/1/8"
            />
            <RenderNode
              num="22"
              nodes="3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,5/1/8,3/1/8"
            />
            <RenderNode
              num="23"
              nodes="2/1/8,2/1/8,2/1/8,2/1/8,2/1/8,2/1/8,3/1/8,5/1/8"
            />
            <RenderNode
              num="24"
              nodes="3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,0/1/8"
            />
            <RenderNode
              num="25"
              nodes="0/2/8,0/2/8,0/2/8,0/2/8,7/2/8,7/3/8,7/2/8,0/2/8"
            />
            <RenderNode
              num="26"
              nodes="2/2/8,2/2/8,2/2/8,2/1/8,2/2/8,4/2/8,5/2/8,2/3/8"
            />
            <RenderNode
              num="27"
              nodes="2/1/8,2/1/8,2/1/8,2/1/8,2/1/8,3/1/8,5/1/8,2/1/8"
            />
            <RenderNode
              num="28"
              nodes="3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,2/1/8,3/1/8,0/1/8"
            />
            <RenderNode
              num="29"
              nodes="0/2/8,0/2/8,0/2/8,7/2/8,7/3/8,7/2/8,0/2/8,7/2/8"
            />
            <RenderNode
              num="30"
              nodes="5/2/8,5/2/8,5/2/8,5/2/8,5/2/8,7/3/8,7/3/8,5/2/16,0/2/16"
            />
            <RenderNode
              num="31"
              nodes="4/2/8,4/2/8,4/2/8,4/2/8,4/2/8,5/2/8,4/2/8,0/2/8"
            />
            <RenderNode
              num="32"
              nodes="2/2/8,2/2/8,2/2/8,2/2/8,2/2/8,9/2/8,9/3/8,8/3/8"
            />
            <RenderNode
              num="33"
              nodes="7/3/8,7/3/8,7/3/8,7/2/8,0/2/8,7/2/8,0/2/8,0/2/8"
            />
            <RenderNode
              num="34"
              nodes="3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,0/1/8"
            />
            <RenderNode
              num="35"
              nodes="2/1/8,2/1/8,2/1/8,0/2/8,2/2/8,2/2/8,2/2/8,2/1/8"
            />
            <RenderNode
              num="36"
              nodes="3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,0/2/8,2/2/8"
            />
            <RenderNode
              num="37"
              nodes="0/2/8,0/2/8,0/2/8,9/3/8,9/3/8,0/2/8,0/2/8,7/2/8"
            />
            <RenderNode
              num="38"
              nodes="5/2/8,5/2/8,5/2/8,5/2/8,7/3/8,5/2/8,7/3/8,5/2/8"
            />
            <RenderNode
              num="39"
              nodes="4/2/8,4/2/8,4/2/8,7/2/8,7/3/8,7/2/8,7/3/8,8/3/8"
            />
            <RenderNode
              num="40"
              nodes="9/3/8,9/3/8,9/2/8,9/2/8,7/1/8,7/1/8,9/2/8,7/1/8"
            />
            <RenderNode
              num="41"
              nodes="5/1/8,5/1/8,5/1/8,5/1/8,7/2/8,5/1/8,7/2/8,5/1/8"
            />
            <RenderNode
              num="42"
              nodes="3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,5/1/8,3/1/8,0/1/8"
            />
            <RenderNode
              num="43"
              nodes="2/1/8,2/1/8,2/1/8,0/2/8,2/2/8,2/2/8,2/2/8,2/1/8"
            />
            <RenderNode
              num="44"
              nodes="3/1/8,3/1/8,3/1/8,3/1/8,3/1/8,0/1/8,2/2/8,3/1/8"
            />
            <RenderNode num="45" nodes="0/2/34,7/2/4" />

            <RenderNode
              num="46"
              nodes="5/2/8,5/2/8,5/2/8,12/3/8,12/3/8,11/3/8,9/3/8"
            />
            <RenderNode num="47" nodes="0/2/4,0/2/8,7/3/8,7/3/8,0/2/8" />
          </Box>
        </SectionBox>
        <SectionBox
          id="section99"
          title={
            "99." +
            getMessage({
              ja: "チューニング",
              us: "tuning",
              cn: "调音",
              language,
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box
            height="80vh"
            style={{
              backgroundImage:
                "url('https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241021054156.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "#fff",
              position: "relative",
            }}
          >
            <Text
              style={{
                padding: "13px",
                paddingTop: "20px",
                textAlign: "left",
                color: "#fff",
                textShadow: "none",
                fontFamily: "'Yomogi', sans-serif",
                fontWeight: "400",
              }}
            >
              4.E
              <br />
              3.A
              <br />
              2.D
              <br />
              1.G
            </Text>
            <Image
              src="/images/hippo.gif"
              alt="Hippo"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                width: "50px",
              }}
            />
          </Box>
        </SectionBox>
        <Box h="3vh" />
      </Frame>
    </>
  );
};

export default BlogPage;
