import NextLink from "next/link";
import { useState, useEffect } from "react";
import Content from "../components/content";
import {
  Container,
  Tag,
  Flex,
  Image,
  Box,
  Text,
  Spacer,
  Center,
  useColorMode,
  useColorModeValue,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";
import styles from "../styles/home.module.scss";
import Moment from "react-moment";
import { useLanguage } from "../context/LanguageContext";
import getMessage from "../components/getMessage";

export default function Home({ blog, category, tag, blog2 }) {
  const [showBlogs, setShowBlogs] = useState(blog);
  const { language, setLanguage } = useLanguage();
  //右リストの読み込みをlanguage取得後にする
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);
  useEffect(() => {
    if (language) {
      setIsLanguageLoaded(true);
    }
  }, [language]);
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "pink.100");
  const color = useColorModeValue("#111111", "#111111");
  const myClass = useColorModeValue(styles.myLight, styles.myDark);
  //右リストの読み込みをlanguage取得後にする
  if (!isLanguageLoaded) {
    return <div>Loading...</div>; // 言語がロードされるまでのプレースホルダー
  }
  return (
    <>
      <Content isCustomHeader={true}>
        <Box mx={[0, 0, 8, 20]} my={[1, 1, 2, 4]}>
          <Box h="10px" />
          <img src="/images/illust/hippo/hippo_001.svg" />
          <img
            src="/images/illust/hippo/hippo_001.svg"
            style={{
              filter:
                "url(#outline-filter) drop-shadow(1px 1px 3px rgba(0, 0, 0, 1))",
              margin: "10px",
              animation: "rabitJump 10s infinite 7s",
            }}
          />
          <svg width="0" height="0">
            <defs>
              <filter id="outline-filter">
                {/* アウトラインを作成 */}
                <feMorphology
                  operator="dilate"
                  radius="2.5"
                  in="SourceAlpha"
                  result="dilated"
                />
                <feFlood floodColor="white" result="flood" />
                <feComposite
                  in="flood"
                  in2="dilated"
                  operator="in"
                  result="outline"
                />
                {/* 黒い線を追加 */}
                <feMorphology
                  operator="dilate"
                  radius="0"
                  in="outline"
                  result="expanded"
                />
                <feFlood floodColor="#333" result="blackFlood" />
                <feComposite
                  in="blackFlood"
                  in2="expanded"
                  operator="in"
                  result="blackOutline"
                />
                <feMerge>
                  <feMergeNode in="blackOutline" />
                  <feMergeNode in="outline" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </Box>
      </Content>
    </>
  );
}
