import React from "react";
import { isValidUrl } from "../utils/urlValidator"; // URLのバリデーション関数をインポート
import { useEffect, useState } from "react"; // 追加

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
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  TimeIcon,
  TriangleDownIcon,
  TriangleUpIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { keyframes } from "@emotion/react";
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
};
// elapsedHoursを画面に表示する処理を追加
class CustomLinkBox extends React.Component<CustomLinkBoxProps> {
  state = {
    fileExists: false, // ファイル存在フラグ
    isModalOpen: false, // モーダルの開閉フラグ
    modalSrc: "", // モーダルのsrc
    isClient: false, // クライアントサイドのフラグ
  };
  handleBoxClick = (src: string) => {
    this.setState({ modalSrc: src, isModalOpen: true });
  };
  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  };
  componentDidMount() {
    this.checkFileExists(); // コンポーネントマウント時にファイルの存在を確認
    this.setState({ isClient: true }); // クライアントサイドのフラグを設定
  }
  checkFileExists = async () => {
    try {
      const response = await fetch(this.props.linkHref, { method: "HEAD" });
      this.setState({ fileExists: response.ok }); // ファイルの存在を設定
    } catch {
      this.setState({ fileExists: false });
    }
  };
  render() {
    const { isClient } = this.state;
    const versionMatch = this.props.linkHref.match(/Sjp([\d.]+)_/);
    const versionMatch2 = this.props.linkHref.match(/main_([\d.]+).zip/);
    const versionMatch3 = this.props.linkHref.match(/camera([\d.]+)_\.zip/);
    let ver = "N/A";
    if (versionMatch) {
      ver = versionMatch[1];
    } else if (versionMatch2) {
      ver = versionMatch2[1];
    } else if (versionMatch3) {
      ver = versionMatch3[1];
    } else {
      const fileNameMatch = this.props.linkHref.match(/\/([^\/]+)$/);
      if (fileNameMatch) {
        ver = fileNameMatch[1];
      }
    }

    const elapsedHours =
      (new Date().getTime() - new Date(this.props.dateTime).getTime()) /
      (1000 * 60 * 60);
    const formattedDateTime = new Date(this.props.dateTime).toLocaleString(
      "ja-JP",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
    const downloadFileName = this.props.linkHref.replace(
      /^\/files\/download\/(Sjp|Jdss|Camera)\//,
      ""
    );
    const downloadPathMatch = this.props.linkHref.match(/^(.*\/)/);
    const downloadPath = downloadPathMatch ? downloadPathMatch[1] : "";

    const inChargeList = this.props.inCharge
      .split(",")
      .map((item) => item.trim());
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
                <Box as="time" dateTime={this.props.dateTime} fontSize="sm">
                  {this.props.isLatest && (
                    <Badge colorScheme="teal" marginRight={2}>
                      Latest
                    </Badge>
                  )}
                  <Badge colorScheme={badgeColor}>{agoText}</Badge>
                </Box>
                {this.state.fileExists && (
                  <Button
                    size="sm"
                    colorScheme="teal"
                    as="a"
                    href={this.props.linkHref}
                    download={downloadFileName}
                    marginLeft="auto"
                    bg={this.props.isLatest ? "teal.500" : "gray.500"} // isLatestがtrueじゃない場合は灰色
                    _hover={{
                      bg: this.props.isLatest ? "teal.600" : "gray.600", // マウスオーバー時の背景色
                    }}
                  >
                    Download
                  </Button>
                )}
              </Box>
              <Heading size="md" my="2">
                <LinkOverlay>{ver}</LinkOverlay>
              </Heading>

              <Divider />
              <TimeIcon boxSize={4} paddingRight={1} mt="-0.5" />
              {formattedDateTime}
              <br />
              {inChargeList.map((inCharge, index) => (
                <Badge
                  key={index}
                  colorScheme={inChargeColors[index].color}
                  variant={inChargeColors[index].variant}
                  sx={inChargeColors[index].sx} // sxプロパティを適用
                  marginRight={1}
                >
                  {inCharge}
                </Badge>
              ))}
              {this.props.description1 &&
                this.props.description1.split("。").map((sentence, index) => (
                  <Box key={index} mt="1">
                    <WarningTwoIcon marginRight="1" color="red.500" mt="-1" />
                    {sentence}
                  </Box>
                ))}
              {this.props.description2 &&
                this.props.description2.split("。").map((sentence, index) => (
                  <Box key={index} mt="1">
                    <CheckCircleIcon marginRight="1" color="teal.500" mt="-1" />
                    {sentence}
                  </Box>
                ))}
              {this.props.descriptionIN && (
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
                        src={`${downloadPath}${ver}_/index.html`} // フォルダ内のindex.htmlを指定
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
                          this.handleBoxClick(
                            `${downloadPath}${ver}_/index.html`
                          )
                        }
                        style={{
                          cursor: "pointer",
                          backgroundColor: "transparent",
                        }} // 追加
                      />
                    </Box>
                    <Text mx={1} fontSize="2xl" color="gray.500">
                      ➡️
                    </Text>
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
                        src={`${downloadPath}${ver}/index.html`} // フォルダ内のindex.htmlを指定
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
                          this.handleBoxClick(
                            `${downloadPath}${ver}/index.html`
                          )
                        } // クリックでモーダルを開く
                        style={{
                          cursor: "pointer",
                          backgroundColor: "transparent",
                        }} // 追加
                      />
                    </Box>
                  </Box>
                  <Divider py={1} />
                  <Text fontSize="sm">{this.props.descriptionIN}</Text>
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
            <PopoverArrow bg={this.props.isLatest ? "teal.500" : "red.500"} />
            <PopoverCloseButton color="white" _focus={{ _focus: "none" }} />
            <PopoverHeader
              bg={this.props.isLatest ? "teal.500" : "red.500"}
              roundedTop="md"
            >
              {this.props.isLatest ? (
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
            {this.state.fileExists ? ( // ファイルが存在する場合のみ表示
              <PopoverFooter>
                <Button
                  bg={this.props.isLatest ? "teal.500" : "red.500"}
                  color="white"
                  _hover={{
                    bg: this.props.isLatest ? "teal.600" : "red.600", // マウスオーバー時の背景色
                  }}
                >
                  <a download={downloadFileName} href={this.props.linkHref}>
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
        <Modal
          isOpen={this.state.isModalOpen}
          onClose={() => this.setState({ isModalOpen: false })}
        >
          <ModalOverlay />
          <ModalContent maxW="90vw" maxH="90vh">
            <ModalCloseButton />
            {/* <ModalHeader></ModalHeader> */}
            <ModalBody mx={0}>
              <Box
                width="99%"
                height={{ base: "30vh", sm: "40vh", md: "50vh", lg: "70vh" }}
                border="none"
                maxW="90vw"
              >
                <iframe
                  src={this.state.modalSrc} // モーダルのsrcを設定
                  style={{ width: "100%", height: "100%", border: "none" }} // iframeのサイズを100%に設定
                  title="Embedded Content"
                />
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }
}
export default CustomLinkBox;
