"use client";

import React, { useState, useEffect } from "react";
import { isValidUrl } from "@/utils/urlValidator"; // URLのバリデーション関数をインポート
import { CustomToast } from "@/components/ui/CustomToast";

import {
  LinkBox,
  Box,
  Text,
  Heading,
  LinkOverlay,
  PopoverFooter,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Link,
  Badge,
  Divider,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  useToast,
  useColorMode,
  Flex,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  TimeIcon,
  TriangleDownIcon,
  TriangleUpIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";

import { keyframes } from "@emotion/react";

import { useLanguage } from "../../../src/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

const shake = keyframes`
  0% { transform: rotate(0deg); }
  70% { transform: rotate(0deg); }
  85% { transform: rotate(-5deg); }
  90% { transform: rotate(5deg); }
  95% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
`;
type CustomLinkBoxProps = {
  dateTime: string;
  description1?: string;
  description2?: string;
  descriptionIN?: string;
  linkHref: string;
  inCharge: string;
  isLatest: boolean;
  userName?: string;
  humanHour?: string;
};

const CustomLinkBox: React.FC<CustomLinkBoxProps> = (props) => {
  const [fileExists, setFileExists] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState("");
  const [isClient, setIsClient] = useState(false);
  const showToast = useToast();
  const { language, setLanguage } = useLanguage();
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    checkFileExists();
    setIsClient(true);
  }, []);

  const checkFileExists = async () => {
    try {
      const response = await fetch(props.linkHref, { method: "HEAD" });
      setFileExists(response.ok);
    } catch {
      setFileExists(false);
    }
  };

  const handleBoxClick = (src: string) => {
    setModalSrc(src);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const versionMatch = props.linkHref.match(/Sjp([\d.]+)_/);
  const versionMatch2 = props.linkHref.match(/main_([\d.]+).zip/);
  const versionMatch3 = props.linkHref.match(/camera([\d.]+)_\.zip/);

  let ver = "N/A";
  if (versionMatch) {
    ver = versionMatch[1];
  } else if (versionMatch2) {
    ver = versionMatch2[1];
  } else if (versionMatch3) {
    ver = versionMatch3[1];
  } else {
    const fileNameMatch = props.linkHref.match(/\/([^\/]+)$/);
    if (fileNameMatch) {
      ver = fileNameMatch[1];
    }
  }

  const elapsedHours =
    (new Date().getTime() - new Date(props.dateTime).getTime()) /
    (1000 * 60 * 60);
  const formattedDateTime = new Date(props.dateTime).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const downloadFileName = props.linkHref.replace(
    /^\/files\/download\/(Sjp|Jdss|Camera|Library_)\//,
    ""
  );
  const downloadPathMatch = props.linkHref.match(/^(.*\/)/);
  const downloadPath = downloadPathMatch ? downloadPathMatch[1] : "";
  const htmlPath = downloadPath.replace("download", "html");

  const inChargeList = props.inCharge.split(",").map((item) => item.trim());
  const inChargeColors = inChargeList.map((inCharge) => {
    if (inCharge === "不具合") {
      return { color: "red", variant: "solid" };
    } else if (inCharge.includes("徳島") || inCharge.includes("高知")) {
      return { color: "green", variant: "outline" };
    } else if (inCharge.includes("新機能")) {
      return {
        color: "green",
        variant: "solid",
        sx: { animation: `${shake} 1s infinite` },
      }; // シェイクアニメーションを追加
    } else {
      return { color: "gray", variant: "solid" };
    }
  });
  let agoText = "";
  let timeDiff = elapsedHours / 24;
  let badgeColor = "gray";
  if (timeDiff >= 365) {
    agoText = Math.floor(timeDiff / 365) + " years ago";
    badgeColor = "gray";
  } else if (timeDiff >= 1) {
    agoText = Math.floor(timeDiff) + " days ago";
    badgeColor = "orange";
  } else if (elapsedHours > 1) {
    agoText = Math.floor(elapsedHours) + " hours ago";
    badgeColor = "purple";
  } else if (elapsedHours < 1 && elapsedHours > 0.5) {
    agoText = Math.floor(elapsedHours * 60) + " minutes ago";
    badgeColor = "teal";
  } else {
    agoText = "A moment ago";
    badgeColor = "teal";
  }

  return (
    <>
      <Popover placement="bottom">
        <PopoverTrigger>
          <LinkBox
            as="article"
            maxW="auto"
            p="2"
            borderWidth="1px"
            rounded="md"
            borderColor="gray.500"
            _hover={{ boxShadow: "dark-lg" }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box as="time" dateTime={props.dateTime} fontSize="sm">
                {props.isLatest && (
                  <Badge colorScheme="teal" marginRight={2}>
                    Latest
                  </Badge>
                )}
                <Badge colorScheme={badgeColor}>{agoText}</Badge>
              </Box>
              {fileExists && (
                <Button
                  size="sm"
                  colorScheme="teal"
                  p={1}
                  h={6}
                  as="a"
                  href={props.linkHref}
                  download={downloadFileName}
                  marginLeft="auto"
                  bg={props.isLatest ? "teal.500" : "gray.500"} // isLatestがtrueじゃない場合は灰色
                  _hover={{
                    bg: props.isLatest ? "teal.600" : "gray.600", // マウスオーバー時の背景色
                  }}
                  onClick={(e) => {
                    if (!props.userName) {
                      e.preventDefault(); // デフォルトのリンク動作を防ぐ
                      showToast({
                        position: "bottom",
                        duration: 4000,
                        isClosable: true,
                        render: ({ onClose }) => (
                          <CustomToast
                            onClose={onClose}
                            title={getMessage({
                              ja: "ダウンロードできません",
                              us: "Cannot download",
                              cn: "无法下载",
                              language,
                            })}
                            description={
                              <>
                                <Box>
                                  {getMessage({
                                    ja: "ダウンロードするにはログインと開発による認証が必要です",
                                    us: "Download requires login and authentication by development",
                                    cn: "下载需要开发人员登录和验证",
                                    language,
                                  })}
                                </Box>
                              </>
                            }
                          />
                        ),
                      });
                    }
                  }}
                >
                  Downloada
                </Button>
              )}
            </Box>
            <Heading size="md" my="1">
              <Flex justify="space-between" align="center">
                <LinkOverlay>{ver}</LinkOverlay>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                >
                  <Box as="span" fontSize="xs">
                    {formattedDateTime}
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    fontSize="xs"
                    mt="1px"
                  >
                    <TimeIcon boxSize={3} mt="-0" fontWeight={600} />
                    <Box as="span" fontWeight={600}>
                      {props.humanHour}
                    </Box>
                  </Box>
                </Box>
              </Flex>
            </Heading>
            <Divider />

            {inChargeList.map((inCharge, index) => (
              <Badge
                key={index}
                colorScheme={inChargeColors[index].color}
                variant={inChargeColors[index].variant}
                sx={{
                  ...inChargeColors[index].sx,
                  textTransform: "none", // アッパーケースを解除
                }} // sxプロパティを適用
                marginRight={1}
              >
                {getMessage({ ja: inCharge, language })}
              </Badge>
            ))}
            {props.description1 &&
              props.description1.split("。").map((sentence, index) => (
                <Box key={index} mt="1" fontWeight={400}>
                  <WarningTwoIcon marginRight="1" color="red.500" mt="-1" />
                  {sentence}
                </Box>
              ))}
            {props.description2 &&
              props.description2.split("。").map((sentence, index) => (
                <Box key={index} mt="1" fontWeight={400}>
                  <CheckCircleIcon marginRight="1" color="teal.500" mt="-1" />
                  {sentence}
                </Box>
              ))}
            {props.descriptionIN && (
              <PopoverBody
                height="auto"
                style={{ border: "none" }}
                p={1}
                maxW="100%"
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box
                    position="relative"
                    width={{
                      base: "45%",
                      sm: "45%",
                      md: "45%",
                      lg: "50%",
                      xl: "50%",
                    }} // 画面サイズに応じて変更
                    height={{
                      base: "100px",
                      sm: "170px",
                      md: "200px",
                      lg: "190px",
                      xl: "240px",
                    }}
                    border="none"
                  >
                    <iframe
                      height="100%"
                      src={`${htmlPath}${ver}_/index.html`} // フォルダ内のindex.htmlを指定
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }} // iframeのサイズを100%に設定
                      title="Embedded Content"
                    />
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      width="100%"
                      height="100%"
                      onClick={() =>
                        handleBoxClick(`${htmlPath}${ver}_/index.html`)
                      }
                      style={{
                        cursor: "pointer",
                        backgroundColor: "transparent",
                      }} // 追加
                    />
                  </Box>
                  <Box mx={1} fontSize="xl" color="gray.500" bg="transparent">
                    →
                  </Box>
                  <Box
                    position="relative"
                    width={{
                      base: "45%",
                      sm: "45%",
                      md: "45%",
                      lg: "50%",
                      xl: "50%",
                    }} // 画面サイズに応じて変更
                    height={{
                      base: "100px",
                      sm: "170px",
                      md: "200px",
                      lg: "190px",
                      xl: "240px",
                    }}
                    border="none"
                  >
                    <iframe
                      height="100%"
                      src={`${htmlPath}${ver}/index.html`} // フォルダ内のindex.htmlを指定
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }} // iframeのサイズを100%に設定
                      title="Embedded Content"
                    />
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      width="100%"
                      height="100%"
                      onClick={() =>
                        handleBoxClick(`${htmlPath}${ver}/index.html`)
                      } // クリックでモーダルを開く
                      style={{
                        cursor: "pointer",
                        backgroundColor: "transparent",
                      }} // 追加
                    />
                  </Box>
                </Box>
                <Divider py={1} />
                <Text fontSize="sm" fontWeight={400}>
                  {props.descriptionIN}
                </Text>
              </PopoverBody>
            )}
          </LinkBox>
        </PopoverTrigger>
        {/* <PopoverContent
          _focus={{ boxShadow: "none" }}
          style={{ border: "1px solid transparent" }}
          maxW={{
            base: "90vw",
            sm: "90vw",
            md: "90vw",
            lg: "80vw",
            xl: "90vw",
          }}
          width={{
            base: "auto",
            sm: "auto",
            md: "720px",
            lg: "660px",
            xl: "760px",
          }}
        >
          <PopoverArrow bg={props.isLatest ? "teal.500" : "red.500"} />
          <PopoverCloseButton color="white" _focus={{ _focus: "none" }} />
          <PopoverHeader
            bg={props.isLatest ? "teal.500" : "red.500"}
            roundedTop="md"
          >
            {props.isLatest ? (
              <Text color="white" padding={2}>
                最新のバージョンです
              </Text>
            ) : (
              <Text color="white" padding={2}>
                最新のバージョンではありません
              </Text>
            )}
          </PopoverHeader>
          <PopoverBody></PopoverBody>
          {fileExists ? ( // ファイルが存在する場合のみ表示
            <PopoverFooter>
              <Button
                bg={props.isLatest ? "teal.500" : "red.500"}
                color="white"
                _hover={{
                  bg: props.isLatest ? "teal.600" : "red.600", // マウスオーバー時の背景色
                }}
              >
                <a download={downloadFileName} href={props.linkHref}>
                  Download
                </a>
              </Button>
            </PopoverFooter>
          ) : (
            <PopoverFooter>
              <Text>ダウンロード期間の終了</Text>
            </PopoverFooter>
          )}
        </PopoverContent> */}
      </Popover>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent maxW="90vw" maxH="90vh">
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          {/* <ModalHeader></ModalHeader> */}
          <ModalBody mx={0}>
            <Box
              width="99%"
              height={{ base: "30vh", sm: "40vh", md: "50vh", lg: "70vh" }}
              border="none"
              maxW="90vw"
            >
              <iframe
                src={modalSrc} // モーダルのsrcを設定
                style={{ width: "100%", height: "100%", border: "none" }} // iframeのサイズを100%に設定
                title="Embedded Content"
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomLinkBox;
