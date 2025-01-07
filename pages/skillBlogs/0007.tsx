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
import { LuPanelRightOpen } from "react-icons/lu";
import { FaDownload } from "react-icons/fa6";
import Content from "../../components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "../../components/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "../../components/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "./customBadge";
import DownloadLink from "./DownloadLink";
import { useUserData } from "../../hooks/useUserData";
import { useUserInfo } from "../../hooks/useUserId";
import { useReadCount } from "../../hooks/useReadCount";
import CustomModal from "./customModal";

import { useLanguage } from "../../context/LanguageContext";
import getMessage from "../../components/getMessage";

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
  const { userId, email } = useUserInfo();
  const { pictureUrl, userName, userCompany, userMainCompany } =
    useUserData(userId);
  const { readByCount } = useReadCount(userId);
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
    return <div>Loading...</div>; // 言語がロードされるまでのプレースホルダー
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
              ja: "生産準備+の練習(初級)",
              us: "Production Preparation+ Practice (Elem)",
              cn: "生产准备+实践（初级）。",
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
              language,
            })}
            :2024-11-19
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
                ja: "多くの機能を追加した結果、文章での理解が難しいものになってしまいました。その為、まず最初に実際に操作して何となく理解する事を推奨しています。とりあえず以下の手順通りにやってみてください。",
                us: "As a result of adding many functions, the text has become difficult to understand. Therefore, we recommend that you first try to understand it somewhat by actually operating it. For now, please try following the steps below.",
                cn: "由于附加功能较多，文本内容难以理解。因此，我们建议您先实际操作一下系统，以便对其有所了解。同时，请尝试按照以下步骤操作。",
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
              ja: "練習用の生産準備+の入手",
              us: "Obtaining a Practice Production Preparation+.",
              cn: "为实践做好生产准备+。",
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
              ja: "ダウンロードして使えるように準備をします。",
              us: "Download and prepare for use.",
              cn: "准备下载和使用。",
              language,
            })}
          </Text>
          <Box m={3}>
            <Text fontWeight="400" my={4}>
              {"2-1." +
                getMessage({
                  ja: "ダウンロードの実行",
                  us: "Download Execution",
                  cn: "表演下载",
                  language,
                })}
            </Text>
            <DownloadLink
              text={getMessage({
                ja: "ダウンロードする ",
                us: "Download ",
                cn: "下载 ",
                language,
              })}
              href="/images/0007/003_練習用.zip"
            />
            <Text fontWeight="400" my={4}>
              {"2-2." +
                getMessage({
                  ja: "ダウンロードフォルダを開く",
                  us: "Open download folder",
                  cn: "打开下载文件夹",
                  language,
                })}
            </Text>
            <Text>
              {getMessage({
                ja: "ダウンロードが完了したら下図が表示されるので赤枠の辺りをクリックします",
                us: "When the download is complete, the following diagram will be displayed, click around the red frame",
                cn: "下载完成后，将显示下图，您可以点击红框周围。",
                language,
              })}
              <br />
              {getMessage({
                ja: "※Edgeの場合は",
                us: "*For Edge",
                cn: "*Edge",
                language,
              })}
            </Text>
            <Image src="/images/0007/0001.png" alt="0001.png" w="60%" />

            <Text
              onClick={() => handleOpen("chrome")}
              cursor="pointer"
              color="blue.500"
            >
              {getMessage({
                ja: "※Chromeの場合",
                us: "*In case of Chrome",
                cn: "*如果使用 Chrome 浏览器。",
                language,
              })}
            </Text>
            <CustomModal
              isOpen={activeDrawer === "chrome"}
              onClose={handleClose}
              title={getMessage({
                ja: "※Chromeの場合",
                us: "*In case of Chrome",
                cn: "*如果使用 Chrome 浏览器。",
                language,
              })}
              modalBody=<>
                <Image src="/images/0007/0004.png" alt="0004.png" />
              </>
            />

            <Text fontWeight="400" my={4}>
              {"2-3." +
                getMessage({
                  ja: "ダウンロードしたファイル(003_練習用.zip)の展開",
                  us: "Extract the downloaded file (003_練習用.zip)",
                  cn: "解压下载的文件 (003_練習用.zip)",
                  language,
                })}
            </Text>
            <Image src="/images/0007/0002.png" alt="0002.png" w="65%" />
            <Text my={4}>
              {getMessage({
                ja: "ダウンロードした.zipを右クリックして「すべて展開」をクリック",
                us: "Right-click on the downloaded .zip and click [Extract All]",
                cn: "右键单击下载的 .zip 文件，然后单击 [全部解压缩]",
                language,
              })}
            </Text>
            <Text fontWeight="400" my={4}>
              {"2-4." +
                getMessage({
                  ja: "展開されたフォルダのエクセルファイルを開く",
                  us: "Open the Excel file in the expanded folder.",
                  cn: "打开扩展文件夹中的 Excel 文件。",
                  language,
                })}
            </Text>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Image src="/images/0007/0003.png" alt="0003.png" w="70%" />
              <Box bg="gray.300" color="black" w="70%" p={1}>
                {getMessage({
                  ja: "このエクエルファイルが生産準備+の本体です",
                  us: "This Equel file is the main body of the Production Preparation+.",
                  cn: "该 Equel 文件是 生产准备+ 的主体。",
                  language,
                })}
              </Box>
            </Flex>
          </Box>
        </SectionBox>
        <SectionBox
          id="section3"
          title={
            "3." +
            getMessage({
              ja: "必要データのインポート",
              us: "Import of required data",
              cn: "导入所需数据",
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
              ja: "必要なファイルをインポートしていきます",
              us: "We will import the necessary files.",
              cn: "导入必要的文件。",
              language,
            })}
          </Text>
          <Box m={3}>
            <Text fontWeight="400" my={4}>
              {"3-1." +
                getMessage({
                  ja: "[MENU]を開く",
                  us: "Open [MENU].",
                  cn: "打开 [MENU]",
                  language,
                })}
            </Text>
            <Image src="/images/0007/0005.png" alt="0002.png" />
            <Text fontWeight="400" my={4}>
              {"3-2." +
                getMessage({
                  ja: "必要ファイルのインポートを行う",
                  us: "Import the necessary files.",
                  cn: "导入必要的文件",
                  language,
                })}
            </Text>

            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <video width="90%" height="100%" loop autoPlay muted>
                <source src="/images/0007/0006.mp4" type="video/mp4" />
                {getMessage({
                  ja: "お使いのブラウザは動画タグをサポートしていません",
                  language,
                })}
              </video>
              <Box bg="gray.300" color="black" w="90%" p={1} mb={6}>
                {getMessage({
                  ja: "入力→01_インポート→RTTFのサブを使用にチェック→全て実行",
                  us: "Input -> 01_Import -> Check Use RTTF sub -> Do all",
                  cn: "输入 → 01_Import → 检查使用 RTTF 子项 → 全部执行。",
                  language,
                })}
                <br />
                {getMessage({
                  ja: "動画と同じようにやってみてください",
                  us: "Try to do the same as in the video.",
                  cn: "试着做和视频中一样的动作。",
                  language,
                })}
              </Box>
              <video width="60%" height="100%" loop autoPlay muted>
                <source src="/images/0007/0007.mp4" type="video/mp4" />
                {getMessage({
                  ja: "お使いのブラウザは動画タグをサポートしていません",
                  language,
                })}
              </video>
              <Box bg="gray.300" color="black" w="60%" p={1}>
                {getMessage({
                  ja: "画面左下に進捗状況が表示されます",
                  us: "Progress is displayed in the lower left corner of the screen",
                  cn: "进度显示在屏幕左下角。",
                  language,
                })}
              </Box>
            </Flex>
          </Box>
        </SectionBox>
        <SectionBox
          id="section4"
          title={
            "4." +
            getMessage({
              ja: "シートの作成",
              us: "Creating Sheets",
              cn: "创建床单",
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
              ja: "再度、[MENU]を開いて下図のように操作してください",
              us: "Open [MENU] again and operate as shown below.",
              cn: "再次打开 [MENU]，如下图所示进行操作。",
              language,
            })}
          </Text>
          <Box m={3}>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <video width="65%" height="100%" loop autoPlay muted>
                <source src="/images/0007/0008.mp4" type="video/mp4" />
                {getMessage({
                  ja: "お使いのブラウザは動画タグをサポートしていません",
                  language,
                })}
              </video>
              <Box bg="gray.300" color="black" w="65%" p={1} mb={6}>
                {getMessage({
                  ja: "入力→02_手入力シート作成→すべて実行をクリック",
                  us: "Input→02_Create Manual Input Sheet→Click on Do All",
                  cn: "输入 → 02_创建手动输入表 → 点击全部运行。",
                  language,
                })}
              </Box>
            </Flex>
            <Text>
              {getMessage({
                ja: "この操作によって複数のシートが作成されます。このシートは不足したデータを補う為に入力する為に使用します。※今回は初級なので入力は省きます。",
                us: "This operation creates multiple sheets. This sheet is used to input data to make up for missing data. Since this is a beginner's course, we will skip the input.",
                cn: "此操作会创建多个工作表。这些工作表用于输入数据，以弥补缺失的数据。*在本例中，由于是初学者，因此省略了输入。",
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
              ja: "成果物の作成",
              us: "Preparation of deliverables",
              cn: "准备交付成果",
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
              ja: "[MENU]を開いて下図のように操作してください",
              us: "Open [MENU] and operate as shown below",
              cn: "打开 [MENU]，按下图所示操作。",
              language,
            })}
          </Text>
          <Box m={3}>
            <Text fontWeight="400" my={4}>
              {"5-1." +
                getMessage({
                  ja: "サブ図の作成",
                  us: "Create sub-diagrams",
                  cn: "创建子图",
                  language,
                })}
            </Text>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <video width="70%" height="100%" loop autoPlay muted>
                <source src="/images/0007/0009.mp4" type="video/mp4" />
                {getMessage({
                  ja: "お使いのブラウザは動画タグをサポートしていません",
                  language,
                })}
              </video>
              <Box bg="gray.300" color="black" w="70%" p={1} mb={6}>
                {getMessage({
                  ja: "40-50_ハメ図 → サブ図 → 製品品番を選択 → 作成",
                  us: "40-50_frame_drawing → sub-drawing → select product part number → create",
                  cn: "40-50_框架图 → 子图 → 选择产品部件号 → 创建",
                  language,
                })}
              </Box>
              <Text>
                {getMessage({
                  ja: "約30秒後に作成されます",
                  us: "It will be created in about 30 seconds.",
                  cn: "约 30 秒后创建。",
                  language,
                })}
              </Text>
            </Flex>
            <Text fontWeight="400" my={4}>
              {"5-2." +
                getMessage({
                  ja: "配策誘導ナビの作成",
                  us: "Creation of a navigation system to guide the allocation of measures",
                  cn: "建立导航系统，指导措施的分配。",
                  language,
                })}
            </Text>

            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <video width="50%" height="100%" loop autoPlay muted>
                <source src="/images/0007/0010.mp4" type="video/mp4" />
                {getMessage({
                  ja: "お使いのブラウザは動画タグをサポートしていません",
                  language,
                })}
              </video>
              <Box bg="gray.300" color="black" w="50%" p={1} mb={6}>
                {getMessage({
                  ja: "50_配策図 → 実行",
                  us: "50_Schematic diagram → Execution",
                  cn: "50_分布图 → 执行",
                  language,
                })}
              </Box>
              <Text>
                {getMessage({
                  ja: "約120秒後に配策誘導ナビが作成されます。",
                  us: "After approximately 120 seconds, a navigation system is created to guide the user through the allocation process.",
                  cn: "大约 120 秒后，分配引导导航系统就会创建。",
                  language,
                })}
                <br />
                {getMessage({
                  ja: "※これはブラウザやブラウザコントロールで表示できます。",
                  us: "*This can be displayed in the browser or browser control.",
                  cn: "*这可以在浏览器或浏览器控件中显示。",
                  language,
                })}
              </Text>
            </Flex>
          </Box>
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
              {getMessage({
                ja: "なんとなく作成までの流れが分かったかと思います。",
                us: "I hope you have somewhat understood the process of creation.",
                cn: "我希望你们对创作过程有了一定的了解。",
                language,
              })}
              <br />
              {getMessage({
                ja: "このように基本はクリックで進めていきます。",
                us: "Thus, the basics are a click away.",
                cn: "这样，只需点击一下，就能获得基本信息。",
                language,
              })}
              <br />
              <br />
              {getMessage({
                ja: "しかし実際には存在しないデータは手入力が必要です。",
                us: "However, data that does not actually exist must be entered manually.",
                cn: "但是，实际不存在的数据需要手动输入。",
                language,
              })}
              {getMessage({
                ja: "次の練習(中級)で手入力を経験してみてください。",
                us: "You can experience manual input in the next exercise (intermediate).",
                cn: "在下一个练习（中级）中体验手动输入。",
                language,
              })}
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
