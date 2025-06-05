"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  HStack,
  Divider,
  Avatar,
  Image,
  Kbd,
  Flex,
  Icon,
  createIcon,
  Spacer,
} from "@chakra-ui/react";
import { LuPanelRightOpen } from "react-icons/lu";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "@/components/ui/customToast";
import SectionBox from "../../components/SectionBox";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "@/components/ui/CustomBadge";
import UnderlinedTextWithDrawer from "../../components/UnderlinedTextWithDrawer";
import ExternalLink from "../../components/ExternalLink";
import { useUserContext } from "@/contexts/useUserContext";
import { useReadCount } from "@/hooks/useReadCount";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
//テキストジャンプアニメーション
const jumpAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
  60% { transform: translateY(-3px); }
`;
//Kbdのスタイル
const kbdStyle = {
  border: "1px solid",
  fontSize: "16px",
  bg: "white",
  mx: 0.5,
  borderRadius: "3px",
  color: "black",
};
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
  const { readByCount } = useReadCount(currentUserId);
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
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // onOpenを追加
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const showToast = useCustomToast();

  const handleOpen = (drawerName: string) => {
    setActiveDrawer(drawerName);
    onOpen();
  };
  const handleClose = () => {
    setActiveDrawer(null);
    onClose();
  };
  //右リストの読み込みをlanguage取得後にする
  if (!isLanguageLoaded) {
  }
  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs}>
        <Box w="100%">
          <HStack spacing={2} align="center" mb={1} ml={1}>
            <Avatar
              size="xs"
              src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
              borderWidth={1}
            />
            <Text>@kataoka</Text>
            <Text>in</Text>
            <Text>
              {getMessage({
                ja: "開発",
              })}
            </Text>
            <Spacer />
            <Flex justifyContent="flex-end">
              <Text>
                <Icon as={CustomIcon} mr={0} />
                {readByCount}
              </Text>
            </Flex>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            {getMessage({
              ja: "コネクタの撮影から座標登録まで",
              us: "From connector shooting to coordinate registration",
              cn: "从拍摄连接器到登记坐标",
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "生準+",
            })}
          />
          <Text
            fontSize="sm"
            color={colorMode === "light" ? "gray.800" : "white"}
            mt={1}
          >
            {getMessage({
              ja: "更新日",
              us: "renewal date",
              cn: "更新日",
            })}
            :2024-11-17
          </Text>
        </Box>
        <SectionBox
          id="section1"
          title={
            "1." +
            getMessage({
              ja: "はじめに",
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Box>
            <Text fontWeight="bold"></Text>
            <Text>
              {getMessage({
                ja: "誰かが撮影したコネクタ画像はみんなで共有した方が良いよね？という考えで開発しました。登録した写真と座標データは共有して使用する事で生産効率の向上を図ります。以下はその手順です。",
                us: "It is better to share connector images taken by someone else with everyone, right? This is the idea behind the development of this system. The registered photos and coordinate data will be shared and used to improve production efficiency. The following is the procedure.",
                cn: "别人拍摄的连接器图像应该由大家共享，对吗？这就是开发该系统的初衷。通过共享已登记的照片和坐标数据，可以提高生产效率。具体流程如下。",
              })}
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title={
            "2." +
            getMessage({
              ja: "カメラアプリの起動",
              us: "Launching the camera application",
              cn: "启动相机应用程序",
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>
            {getMessage({
              ja: "専用のカメラアプリで撮影して保存します",
              us: "Take a picture with the dedicated camera app and save it.",
              cn: "使用专用相机应用程序拍摄并保存照片",
            })}
          </Text>
          <Box m={3}>
            <Text fontWeight="400" my={4}>
              2-1.
              {getMessage({
                ja: "生産準備+の[端末一覧]を選択",
                us: "Select [端末一覧] under Production Preparation+",
                cn: "在生产准备+ 中选择 [端末一覧]",
              })}
            </Text>
            <Text fontWeight="400" my={4}>
              2-2.
              {getMessage({
                ja: "撮影する端末/コネクタ品番を選択",
                us: "Select the device/connector part number to be photographed",
                cn: "选择要拍摄的设备/连接器部件号。",
              })}
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              {getMessage({
                ja: "下図は11行目(7283-0391-30)を選択している状態です",
                us: "The figure below shows line 11 (7283-0391-30) selected",
                cn: "下图显示选择了第 11 行（7283-0391-30）。",
              })}
            </Box>
            <Image src="/images/0001/0002.png" alt="0002.png" />
            <Text fontWeight="400" my={4}>
              2-3.
              {getMessage({
                ja: "",
                us: "press ",
                cn: "",
              })}
              <Kbd {...kbdStyle}>Ctrl</Kbd>+<Kbd {...kbdStyle}>Enter</Kbd>
              {getMessage({
                ja: " を押す",
                us: "",
                cn: " 压机",
              })}
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              {getMessage({
                ja: "撮影ソフト(camera+)が起動します",
                us: "The camera+ software will start.",
                cn: "相机软件 (camera+) 启动。",
              })}
            </Box>
            <Image src="/images/0001/0013.png" alt="0013.png" />
            <Text>
              {getMessage({
                ja: "※インストールされていない場合はインストール画面が表示されるのでインストールを行ってください。",
                us: "If it is not installed, the installation screen will be displayed, so please install it.",
                cn: "*如果未安装，将显示安装屏幕，请安装。",
              })}
            </Text>
          </Box>
          <Text textAlign="center">
            {getMessage({
              ja: "--そのうち追加--",
              us: "--Sooner or later, add--",
              cn: "--迟早要加--",
            })}
          </Text>
        </SectionBox>
        <SectionBox
          id="section3"
          title={
            "3." +
            getMessage({
              ja: "コネクタ写真の加工(通常)",
              us: "Processing of connector photos (normal)",
              cn: "处理连接器照片（正常）",
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text display="inline">
            {getMessage({
              ja: "無料の画像編集ソフト",
              us: "Free image editing software",
              cn: "免费图像编辑软件",
            })}
            <UnderlinedTextWithDrawer
              text=<>
                <Box as="span" display="inline" borderBottom="2px solid">
                  InkScape
                </Box>
                <LuPanelRightOpen
                  size="20px"
                  style={{ marginBottom: "-5px", display: "inline" }}
                />
              </>
              onOpen={() => handleOpen("InkScape")}
              isOpen={isOpen && activeDrawer === "InkScape"}
              onClose={handleClose}
              header={getMessage({
                ja: "InkScapeとは",
                us: "What is InkScape?",
                cn: "什么是 InkScape？",
              })}
              children={
                <Box>
                  <Image
                    src="/images/brandIcons/logo_inkscape.svg"
                    alt="logo_inkscape.svg"
                    w="36px"
                    h="36px"
                    mb={2}
                  />
                  <Text>
                    <span style={{ fontWeight: "600" }}>InkScape</span>
                    {getMessage({
                      ja: "は、コンピュータで絵を描くための無料のソフトです。特に「ベクターグラフィックス」という方法で絵を描けます。",
                      us: "is a free software for drawing pictures on your computer. In particular, you can draw pictures using the [vector graphics] method.",
                      cn: "是一款在电脑上绘制图片的免费软件。特别是，它允许您使用一种称为 [vector graphics]的方法来绘制图片。",
                    })}
                  </Text>
                  <Text fontWeight="600" mt={4}>
                    {getMessage({
                      ja: "ベクターグラフィックスって何？",
                      us: "What is vector graphics?",
                      cn: "vector graphics 是什么？",
                    })}
                  </Text>
                  <Text>
                    {getMessage({
                      ja: "拡大してもきれい",
                      us: "Beautiful even when enlarged",
                      cn: "放大后非常漂亮",
                    })}
                    :
                    {getMessage({
                      ja: "普通の写真や画像は、拡大するとぼやけてしまいます。でも、ベクターグラフィックスは、どんなに拡大しても線がくっきりしています。これは、絵が線や形で表現されているからです。",
                      us: "Ordinary photos and images become blurred when enlarged. However, in vector graphics, lines are clear no matter how much they are enlarged. This is because the picture is represented by lines and shapes.",
                      cn: "普通照片和图像放大后会变得模糊不清。但对于矢量图形，无论放大多少，线条都很清晰。这是因为图片是用线条和形状来表示的。",
                    })}
                  </Text>
                  <Text fontWeight="600" mt={4}>
                    {getMessage({
                      ja: "Inkscapeのいいところ",
                      us: "What I like about Inkscape",
                      cn: "Inkscape 的优点",
                    })}
                  </Text>
                  <Text>
                    {getMessage({
                      ja: "無料で使える",
                      us: "Free of charge",
                      cn: "免费。",
                    })}
                    :
                    {getMessage({
                      ja: "お金を払わなくても、誰でも自由にダウンロードして使えます。",
                      us: "Anyone is free to download and use it without paying.",
                      cn: "任何人都可以免费下载和使用，无需付费。",
                    })}
                  </Text>
                  <Text
                    fontWeight="600"
                    mt={4}
                    animation={`${jumpAnimation} 1s infinite`} // アニメーションを適用
                  >
                    {getMessage({
                      ja: "注意点",
                      us: "point of attention",
                      cn: "注意点",
                    })}
                  </Text>
                  <Text>
                    {getMessage({
                      ja: "通常の会社ではソフトのインストール許可申請が必要です。許可が降りてからインストールを行なってください。",
                      us: "Normal companies require an application for permission to install the software. Please install the software only after permission is granted.",
                      cn: "在普通公司，安装软件需要申请许可。只有在获得许可后才能进行安装。",
                    })}
                  </Text>
                </Box>
              }
            />
            {getMessage({
              ja: "で写真の背景除去を行います",
              us: "to remove the background of a photo",
              cn: "移除照片背景。",
            })}
          </Text>
          <Box m={3}>
            <Text fontWeight="400" my={4}>
              3-1.
              {getMessage({
                ja: "生産準備+の[端末一覧]を選択",
                us: "Select [Terminal List] under Production Preparation+.",
                cn: "在生产准备+ 中选择 [终端列表]。",
              })}
            </Text>
            <Text fontWeight="400" my={4}>
              3-2.
              {getMessage({
                ja: "登録/修正したい部品品番を選択",
                us: "Select the part number you wish to register/modify",
                cn: "选择要注册/修改的零件编号。",
              })}
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              {getMessage({
                ja: "下図は11行目(7283-0391-30)を選択している状態です",
                us: "The figure below shows line 11 (7283-0391-30) selected",
                cn: "下图显示选择了第 11 行（7283-0391-30）。",
              })}
            </Box>
            <Image src="/images/0001/0002.png" alt="0002.png" />
            <Text fontWeight="400" my={4}>
              3-3.
              {getMessage({
                ja: "",
                us: "press ",
                cn: "",
              })}
              <Kbd {...kbdStyle}>Shift</Kbd>+<Kbd {...kbdStyle}>Enter</Kbd>
              {getMessage({
                ja: "を押す",
                us: "",
                cn: "按下",
              })}
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              {getMessage({
                ja: "写真加工ソフト(InkScape)がインストールされていない場合はダウンロードサイトが開きます",
                us: "If the photo processing software (InkScape) is not installed, the download site will open.",
                cn: "如果未安装照片处理软件 (InkScape)，将打开下载网站。",
              })}
            </Box>
            <Image src="/images/0001/0007.png" alt="0007.png" />
            <Text>
              {getMessage({
                ja: "※InkScapeのダウンロードアドレスが変わっていたら開きません。その場合はブラウザ(Edgeとか)で検索してダウンロードサイトを探してください。",
                us: "*If the InkScape download address has changed, it will not open. In that case, please search with your browser (like Edge) to find the download site.",
                cn: "*如果 InkScape 下载地址已更改，则无法打开。在这种情况下，请使用浏览器（Edge 或类似浏览器）搜索下载网站。",
              })}
            </Text>
            <Text my={4}>
              {getMessage({
                ja: "上図の赤枠辺りをクリックして進みます。",
                us: "Click around the red frame in the figure above to proceed.",
                cn: "点击上图中红色方框的周围，继续操作。",
              })}
            </Text>
            <Text my={4}>
              3-4.
              {getMessage({
                ja: "下図の赤枠辺りをクリックしてダウンロードページを開きます。",
                us: "Click around the red frame in the figure below to open the download page.",
                cn: "点击下图中红色方框的周围，打开下载页面。",
              })}
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              {getMessage({
                ja: "お使いのパソコンに最適なバージョンが自動選択されます",
                us: "The version most suitable for your computer is automatically selected.",
                cn: "系统会自动选择最适合您电脑的版本。",
              })}
            </Box>
            <Image src="/images/0001/0008.png" alt="0008.png" />
            <Text my={4}>
              3-5.
              {getMessage({
                ja: "[click here]をクリックしてダウンロード開始",
                us: "Click [click here] to start downloading",
                cn: "点击 [click here] 开始下载",
              })}
            </Text>
            <Image src="/images/0001/0009.png" alt="0009.png" />
            <Text>
              {getMessage({
                ja: "※ダウンロードが上手く出来ない場合はシステム管理者などにご相談ください",
                us: "*If you have trouble downloading, please consult your system administrator.",
                cn: "*如果在下载过程中遇到问题，请咨询系统管理员或其他相关人员。",
              })}
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section4"
          title={
            "4." +
            getMessage({
              ja: "コネクタ写真の加工(簡単)",
              us: "Processing connector photos (easy)",
              cn: "处理连接器照片（简单）",
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <Text>
            {getMessage({
              ja: "この方法では簡単に背景除去ができます。コネクタと背景のコントラストがある一定必要です。端子写真は電線部分の除去は出来ません。",
              us: "This method allows for easy background removal. A certain amount of contrast between the connector and the background is required. For terminal photos, it is not possible to remove the wire portion.",
              cn: "这种方法可以轻松去除背景。连接器与背景之间需要有一定的对比度。在端子照片中无法去除导线部分。",
            })}
          </Text>
          <Box m={3}>
            <Text my={4}>
              4-1.
              {getMessage({
                ja: "下記のWEBサイトを開く",
                us: "Open the following WEB site",
                cn: "打开以下网站",
              })}
            </Text>
            <ExternalLink
              href={getMessage({
                ja: "https://www.photoroom.com/ja/tools/background-remover",
                us: "https://www.photoroom.com/tools/background-remover",
                cn: "https://www.photoroom.com/zh/tools/background-remover",
              })}
              text="photoroom.com/tools/background-remover"
            />
            <Text display="inline-block" mt={4}>
              4-2.
              <UnderlinedTextWithDrawer
                text=<>
                  <Box as="span" display="inline" borderBottom="2px solid">
                    Photoroom
                  </Box>
                  <LuPanelRightOpen
                    size="20px"
                    style={{ marginBottom: "-5px", display: "inline" }}
                  />
                </>
                onOpen={() => handleOpen("Photoroom")}
                isOpen={isOpen && activeDrawer === "Photoroom"}
                onClose={handleClose}
                header={getMessage({
                  ja: "Photoroomの使い方",
                  us: "How to use Photoroom",
                  cn: "如何使用 Photoroom",
                })}
                size="md"
                children={
                  <Box>
                    <video width="100%" height="100%" loop autoPlay muted>
                      <source
                        src="/images/0001/howToPhotoroom.mp4"
                        type="video/mp4"
                      />
                      {getMessage({
                        ja: "お使いのブラウザは動画タグをサポートしていません。",
                        us: "Your browser does not support video tags.",
                        cn: "您的浏览器不支持视频标记。",
                      })}
                    </video>
                    <Text mt={4}>
                      <span style={{ fontWeight: "600" }}>Photoroom</span>
                      {getMessage({
                        ja: "は、ブラウザ上で動作する画像加工WEBアプリです。2024/11/16現在は無料です。",
                        us: "is an image processing web application that runs in your browser and is free as of 2024/11/16.",
                        cn: "是一款图像处理网络应用程序，可在浏览器中运行，自 2024 年 11 月 16 日起免费。",
                      })}
                    </Text>
                    <Text fontWeight="600" mt={4}>
                      {getMessage({
                        ja: "使い方",
                        us: "How to use",
                        cn: "如何使用",
                      })}
                    </Text>
                    <Text>
                      {"1." +
                        getMessage({
                          ja: "上の動画のように加工したい写真をドラッグすると背景が除去されます。",
                          us: "Drag the photo you want to process as shown in the video above to remove the background.",
                          cn: "拖动要处理的照片，移除背景，如上视频所示。",
                        })}
                      <br />
                      {"2." +
                        getMessage({
                          ja: "ダウンロード(標準解像度)してパソコンに保存します。",
                          us: "Download (standard resolution) and save to your computer.",
                          cn: "下载（标准分辨率）并保存在电脑上。",
                        })}
                    </Text>
                  </Box>
                }
              />
              {getMessage({
                ja: "で写真の背景除去を行なってダウンロードします",
                us: "to remove the background of the photo and download it",
                cn: "移除照片背景并下载。",
              })}
            </Text>
            <Text my={4}>
              4-3.
              {getMessage({
                ja: "ダウンロードしたファイルをリネームします。",
                us: "Rename the downloaded file.",
                cn: "重命名下载的文件。",
              })}
            </Text>
            <Text ml={4}>
              {getMessage({
                ja: "例)",
                us: "Example:",
                cn: "例)",
              })}
              <br />
              7283-0391-30.png
              <br />
              ⇩<br />
              7283-0391-30_1_001.png
            </Text>
            <Text my={4}>
              4-4.
              {getMessage({
                ja: "ファイルを任意の場所に保存します。",
                us: "Save the file to any location.",
                cn: "将文件保存到所需位置。",
              })}
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section5"
          title={
            "5." +
            getMessage({
              ja: "コネクタ座標の編集",
              us: "Editing Connector Coordinates",
              cn: "编辑连接器坐标",
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
        </SectionBox>
        <SectionBox
          id="section6"
          title={
            "6." +
            getMessage({
              ja: "まとめ",
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
                fontWeight: "bold",
              }}
            ></Text>
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
        <Box h="5vh" />
      </Frame>
    </>
  );
};

export default BlogPage;
