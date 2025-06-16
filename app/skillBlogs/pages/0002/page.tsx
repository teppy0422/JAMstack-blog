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

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

import AboutInkScape from "@/components/modals/AboutInkScape";
import Photoroom from "@/components/modals/Photoroom";
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
                language,
              })}
            </Text>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            {getMessage({
              ja: "コネクタの撮影から座標登録まで",
              us: "From connector shooting to coordinate registration",
              cn: "从拍摄连接器到登记坐标",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "生準+",
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
              us: "renewal date",
              cn: "更新日",
              language,
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
          <Box>
            <Text fontWeight="bold"></Text>
            <Text>
              {getMessage({
                ja: "誰かが撮影したコネクタ画像はみんなで共有した方が良いよね？という考えで開発しました。登録した写真と座標データは共有して使用する事で生産効率の向上を図ります。以下はその手順です。",
                us: "It is better to share connector images taken by someone else with everyone, right? This is the idea behind the development of this system. The registered photos and coordinate data will be shared and used to improve production efficiency. The following is the procedure.",
                cn: "别人拍摄的连接器图像应该由大家共享，对吗？这就是开发该系统的初衷。通过共享已登记的照片和坐标数据，可以提高生产效率。具体流程如下。",
                language,
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
          <Text>
            {getMessage({
              ja: "専用のカメラアプリで撮影して保存します",
              us: "Take a picture with the dedicated camera app and save it.",
              cn: "使用专用相机应用程序拍摄并保存照片",
              language,
            })}
          </Text>
          <Box m={3}>
            <Text fontWeight="400" my={4}>
              2-1.
              {getMessage({
                ja: "生産準備+の[端末一覧]を選択",
                us: "Select [端末一覧] under Production Preparation+",
                cn: "在生产准备+ 中选择 [端末一覧]",
                language,
              })}
            </Text>
            <Text fontWeight="400" my={4}>
              2-2.
              {getMessage({
                ja: "撮影する端末/コネクタ品番を選択",
                us: "Select the device/connector part number to be photographed",
                cn: "选择要拍摄的设备/连接器部件号。",
                language,
              })}
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              {getMessage({
                ja: "下図は11行目(7283-0391-30)を選択している状態です",
                us: "The figure below shows line 11 (7283-0391-30) selected",
                cn: "下图显示选择了第 11 行（7283-0391-30）。",
                language,
              })}
            </Box>
            <Image src="/images/0001/0002.png" alt="0002.png" />
            <Text fontWeight="400" my={4}>
              2-3.
              {getMessage({
                ja: "",
                us: "press ",
                cn: "",
                language,
              })}
              <Kbd {...kbdStyle}>Ctrl</Kbd>+<Kbd {...kbdStyle}>Enter</Kbd>
              {getMessage({
                ja: " を押す",
                us: "",
                cn: " 压机",
                language,
              })}
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              {getMessage({
                ja: "撮影ソフト(camera+)が起動します",
                us: "The camera+ software will start.",
                cn: "相机软件 (camera+) 启动。",
                language,
              })}
            </Box>
            <Image src="/images/0001/0013.png" alt="0013.png" />
            <Text>
              {getMessage({
                ja: "※インストールされていない場合はインストール画面が表示されるのでインストールを行ってください。",
                us: "If it is not installed, the installation screen will be displayed, so please install it.",
                cn: "*如果未安装，将显示安装屏幕，请安装。",
                language,
              })}
            </Text>
          </Box>
          <Text textAlign="center">
            {getMessage({
              ja: "--そのうち追加--",
              us: "--Sooner or later, add--",
              cn: "--迟早要加--",
              language,
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
          <Text display="inline">
            {getMessage({
              ja: "無料の画像編集ソフト",
              us: "Free image editing software",
              cn: "免费图像编辑软件",
              language,
            })}
            <AboutInkScape />

            {getMessage({
              ja: "で写真の背景除去を行います",
              us: "to remove the background of a photo",
              cn: "移除照片背景。",
              language,
            })}
          </Text>
          <Box m={3}>
            <Text fontWeight="400" my={4}>
              3-1.
              {getMessage({
                ja: "生産準備+の[端末一覧]を選択",
                us: "Select [Terminal List] under Production Preparation+.",
                cn: "在生产准备+ 中选择 [终端列表]。",
                language,
              })}
            </Text>
            <Text fontWeight="400" my={4}>
              3-2.
              {getMessage({
                ja: "登録/修正したい部品品番を選択",
                us: "Select the part number you wish to register/modify",
                cn: "选择要注册/修改的零件编号。",
                language,
              })}
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              {getMessage({
                ja: "下図は11行目(7283-0391-30)を選択している状態です",
                us: "The figure below shows line 11 (7283-0391-30) selected",
                cn: "下图显示选择了第 11 行（7283-0391-30）。",
                language,
              })}
            </Box>
            <Image src="/images/0001/0002.png" alt="0002.png" />
            <Text fontWeight="400" my={4}>
              3-3.
              {getMessage({
                ja: "",
                us: "press ",
                cn: "",
                language,
              })}
              <Kbd {...kbdStyle}>Shift</Kbd>+<Kbd {...kbdStyle}>Enter</Kbd>
              {getMessage({
                ja: "を押す",
                us: "",
                cn: "按下",
                language,
              })}
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              {getMessage({
                ja: "写真加工ソフト(InkScape)がインストールされていない場合はダウンロードサイトが開きます",
                us: "If the photo processing software (InkScape) is not installed, the download site will open.",
                cn: "如果未安装照片处理软件 (InkScape)，将打开下载网站。",
                language,
              })}
            </Box>
            <Image src="/images/0001/0007.png" alt="0007.png" />
            <Text>
              {getMessage({
                ja: "※InkScapeのダウンロードアドレスが変わっていたら開きません。その場合はブラウザ(Edgeとか)で検索してダウンロードサイトを探してください。",
                us: "*If the InkScape download address has changed, it will not open. In that case, please search with your browser (like Edge) to find the download site.",
                cn: "*如果 InkScape 下载地址已更改，则无法打开。在这种情况下，请使用浏览器（Edge 或类似浏览器）搜索下载网站。",
                language,
              })}
            </Text>
            <Text my={4}>
              {getMessage({
                ja: "上図の赤枠辺りをクリックして進みます。",
                us: "Click around the red frame in the figure above to proceed.",
                cn: "点击上图中红色方框的周围，继续操作。",
                language,
              })}
            </Text>
            <Text my={4}>
              3-4.
              {getMessage({
                ja: "下図の赤枠辺りをクリックしてダウンロードページを開きます。",
                us: "Click around the red frame in the figure below to open the download page.",
                cn: "点击下图中红色方框的周围，打开下载页面。",
                language,
              })}
            </Text>
            <Box bg="gray.300" color="black" w="100%" p={1}>
              {getMessage({
                ja: "お使いのパソコンに最適なバージョンが自動選択されます",
                us: "The version most suitable for your computer is automatically selected.",
                cn: "系统会自动选择最适合您电脑的版本。",
                language,
              })}
            </Box>
            <Image src="/images/0001/0008.png" alt="0008.png" />
            <Text my={4}>
              3-5.
              {getMessage({
                ja: "[click here]をクリックしてダウンロード開始",
                us: "Click [click here] to start downloading",
                cn: "点击 [click here] 开始下载",
                language,
              })}
            </Text>
            <Image src="/images/0001/0009.png" alt="0009.png" />
            <Text>
              {getMessage({
                ja: "※ダウンロードが上手く出来ない場合はシステム管理者などにご相談ください",
                us: "*If you have trouble downloading, please consult your system administrator.",
                cn: "*如果在下载过程中遇到问题，请咨询系统管理员或其他相关人员。",
                language,
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
          <Text>
            {getMessage({
              ja: "この方法では簡単に背景除去ができます。コネクタと背景のコントラストがある一定必要です。端子写真は電線部分の除去は出来ません。",
              us: "This method allows for easy background removal. A certain amount of contrast between the connector and the background is required. For terminal photos, it is not possible to remove the wire portion.",
              cn: "这种方法可以轻松去除背景。连接器与背景之间需要有一定的对比度。在端子照片中无法去除导线部分。",
              language,
            })}
          </Text>
          <Box m={3}>
            <Text my={4}>
              4-1.
              {getMessage({
                ja: "下記のWEBサイトを開く",
                us: "Open the following WEB site",
                cn: "打开以下网站",
                language,
              })}
            </Text>
            <ExternalLink
              href={getMessage({
                ja: "https://www.photoroom.com/ja/tools/background-remover",
                us: "https://www.photoroom.com/tools/background-remover",
                cn: "https://www.photoroom.com/zh/tools/background-remover",
                language,
              })}
              text="photoroom.com/tools/background-remover"
            />
            <Text display="inline-block" mt={4}>
              4-2.
              <Photoroom />
              {getMessage({
                ja: "で写真の背景除去を行なってダウンロードします",
                us: "to remove the background of the photo and download it",
                cn: "移除照片背景并下载。",
                language,
              })}
            </Text>
            <Text my={4}>
              4-3.
              {getMessage({
                ja: "ダウンロードしたファイルをリネームします。",
                us: "Rename the downloaded file.",
                cn: "重命名下载的文件。",
                language,
              })}
            </Text>
            <Text ml={4}>
              {getMessage({
                ja: "例)",
                us: "Example:",
                cn: "例)",
                language,
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
                language,
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
        </SectionBox>
        <SectionBox
          id="section6"
          title={
            "6." +
            getMessage({
              ja: "まとめ",
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
            pb={20}
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
      </Frame>
    </>
  );
};

export default BlogPage;
