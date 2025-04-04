import NextLink from "next/link";
import { useState, useEffect, useId } from "react";
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
  Input,
  Avatar,
} from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";
import styles from "../styles/home.module.scss";
import Moment from "react-moment";
import { useLanguage } from "../context/LanguageContext";
import getMessage from "../components/getMessage";
import { CustomLoading } from "../components/CustomText";

import { useUserContext } from "../context/useUserContext";
import { StatusDisplay } from "../components/NowStatus";
import { AnimationImage } from "../components/CustomImage";

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
  const {
    currentUserId,
    currentUserPictureUrl,
    currentUserEmail,
    currentUserCreatedAt,
    getUserById,
    isLoading,
  } = useUserContext();

  // 左スライドでメニュー開く
  const [positions, setPositions] = useState([0, 0, 0]); // 各要素の位置を配列で管理
  const [originalPositions, setOriginalPositions] = useState([0, 0, 0]); // 元の位置を保存
  const [isMoving, setIsMoving] = useState(false); // スライド中かどうかの状態
  const [startX, setStartX] = useState(0); // マウスの開始位置
  const [activeIndex, setActiveIndex] = useState(null); // 現在スライド中の要素のインデックス
  const [message, setMessage] = useState(""); // メッセージの状態を追加
  const handleMouseDown = (index, e) => {
    setIsMoving(true);
    setActiveIndex(index);
    setStartX(e.clientX || e.touches[0].clientX);
    setOriginalPositions([...positions]); // 現在の位置を元の位置として保存
  };
  const handleMouseMove = (e) => {
    if (isMoving && activeIndex !== null) {
      const dx = (e.clientX || e.touches[0].clientX) - startX;
      // 左に移動している場合
      if (dx < 0) {
        document.body.style.userSelect = "none"; // ユーザー選択を無効にする
        document.body.style.cursor = "pointer";
        // 各要素の位置を更新
        setPositions((prevPositions) =>
          prevPositions.map((pos, index) => {
            // 50px移動したらメッセージを表示
            if (
              index === activeIndex &&
              Math.abs(pos + dx) >= 100 &&
              message === ""
            ) {
              setMessage("50px左に移動しました！"); // メッセージを設定
            }
            return index === activeIndex ? pos + dx : pos; // スライド中の要素のみ位置を更新
          })
        );
      }
      setStartX(e.clientX || e.touches[0].clientX);
    }
  };
  const handleMouseUp = () => {
    setIsMoving(false);
    setActiveIndex(null);
    setMessage("");
    setPositions(originalPositions); // 元の位置に戻す
    document.body.style.cursor = "";
    setTimeout(() => {
      document.body.style.userSelect = "auto";
    }, 500);
  };

  if (isLoading) {
    return <div>Loading...</div>; // 言語がロードされるまでのプレースホルダー
  }
  const userData = currentUserId ? getUserById(currentUserId) : null;

  return (
    <>
      <StatusDisplay />

      <Content isCustomHeader={true}>
        <>
          {isLoading ? (
            <Box>isLoading is true</Box>
          ) : (
            <Box>isLoading is false</Box>
          )}
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" flexDirection="column" alignItems="center">
              {positions.map((position, index) => (
                <Box
                  my={10}
                  key={index} // 各要素にユニークなキーを設定
                  style={{
                    transform: `translateX(${position}px)`, // 各要素の位置を変更
                    transition: isMoving ? "none" : "transform 0.3s ease", // スムーズな移動を実現
                  }}
                  onMouseDown={(e) => handleMouseDown(index, e)} // クリック開始
                  onMouseUp={handleMouseUp} // クリック終了
                  onMouseMove={handleMouseMove} // マウス移動を追跡
                  onMouseLeave={handleMouseUp} // マウスが離れたときも元に戻す
                  onTouchStart={(e) => handleMouseDown(index, e)} // タッチ開始
                  onTouchEnd={handleMouseUp} // タッチ終了
                  onTouchMove={handleMouseMove} // タッチ移動を追跡
                >
                  <Box bg="orange" p="3px" borderRadius="5px">
                    {`要素 ${index * index * index * 1000}`}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          {message && <Text mt={4}>{message}</Text>} {/* メッセージを表示 */}
          <Box>{currentUserId}</Box>
          <Box>{userData?.user_metadata.name}</Box>
          <Box>{currentUserEmail}</Box>
          <Avatar src={userData?.picture_url || undefined} size="md" />
          <Box>{currentUserPictureUrl}</Box>
          <Avatar src={currentUserPictureUrl || undefined} size="md" />
          <Box mx={[0, 0, 8, 20]} my={[1, 1, 2, 4]}>
            <Box h="10px" />
            <img src="/images/illust/hippo/hippo_007_pixcel.gif" />
            <AnimationImage
              src="/images/illust/hippo/hippo_007_pixcel.gif"
              width="70px"
              position="static"
              label="焼き鳥まだかなー"
            />
            <AnimationImage
              src="/images/illust/hippo/hippo_007_pixcel.png"
              width="70px"
              position="static"
            />
            <img src="/images/illust/hippo/hippo_001.svg" />
            <img
              src="/images/illust/hippo/hippo_001.svg"
              style={{
                filter:
                  "url(#outline-filter) drop-shadow(1px 1px 3px rgba(0, 0, 0, 1))",
                margin: "10px",
                animation:
                  "rabitJump 10s infinite 7s, waveFall 3s ease-out forwards", // 新しいアニメーションを追加
              }}
            />
            <img src="/images/illust/hippo/sample.svg" width="200px" />
            <img
              src="/images/illust/hippo/sample.svg"
              width="200px"
              style={{
                filter:
                  "url(#outline-filter) drop-shadow(1px 1px 3px rgba(0, 0, 0, 1))",
                margin: "10px",
                animation:
                  "rabitJump 10s infinite 7s, waveFall 3s ease-out forwards", // 新しいアニメーションを追加
              }}
            />
            <style jsx>{`
              @keyframes waveFall {
                0% {
                  transform: translateY(-100px) rotate(0deg);
                  opacity: 0;
                }
                25% {
                  transform: translateY(-50px) rotate(10deg);
                  opacity: 0.5;
                }
                50% {
                  transform: translateY(0) rotate(-10deg);
                  opacity: 1;
                }
                75% {
                  transform: translateY(10px) rotate(5deg);
                  opacity: 1;
                }
                100% {
                  transform: translateY(0) rotate(0deg);
                  opacity: 1;
                }
              }
            `}</style>
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
                  <feFlood floodColor="#111" result="blackFlood" />
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
          <CustomLoading
            text="LOADING LOADING LOADING "
            radius={40}
            fontSize={11}
            imageUrl="/images/illust/hippo/hippo_014.svg"
            imageSize={40}
            color="#FFF"
          />
        </>
      </Content>
    </>
  );
}
