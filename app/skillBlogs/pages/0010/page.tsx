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
import UnderlinedTextWithDrawer from "../../components/UnderlinedTextWithDrawer";
import ExternalLink from "../../components/ExternalLink";
import { FileSystemNode } from "@/components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import ImageSliderModal from "../../components/ImageSliderModal"; // モーダルコンポーネントをインポート
import ReferenceSettingModal from "../../components/howTo/referenceSettingModal";
import { useUserContext } from "@/contexts/useUserContext";
import { supabase } from "@/utils/supabase/client";
import { useReadCount } from "@/hooks/useReadCount";
import { getIpAddress } from "@/lib/getIpAddress";
import { BsFiletypeExe } from "react-icons/bs";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import DownloadButton from "@/components/ui/DownloadButton";
import UnzipModal from "app/skillBlogs/components/howTo/UnzipModal";

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
  const [ipAddress, setIpAddress] = useState("");

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
  useEffect(() => {
    const fetchIpAddress = async () => {
      const ip = await getIpAddress();
      setIpAddress(ip);
    };
    fetchIpAddress();
  }, []);

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
              ja: "誘導ポイント設定一覧表の使い方",
              us: "How to use the Guidance Point Setting List",
              cn: "如何使用感应点设置列表。",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "誘導ポイント設定",
              us: "Guidance point setting",
              cn: "感应点设置",
              language,
            })}
          />
          <CustomBadge
            text={getMessage({
              ja: "作成途中",
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
            :2025-05-26
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
            <Text>
              {getMessage({
                ja: "作業順を記した手順書にLED番号が有りますよね？その手順書を見ながら制御器のデータを手入力作成していると思います。手順書から制御器に直接書き込むシステムを作成しました。",
                us: "There are LED numbers in the procedure manual that describes the work order, aren't there? I think you are manually inputting data into the controller while looking at the procedure manual. We have created a system that directly writes data from the procedure manual to the controller.",
                cn: "程序手册中不是有描述操作顺序的 LED 编号吗？我认为控制器的数据是在查看程序手册时手动创建的。我们创建了一个系统，可以直接从程序手册写入控制器。",
                language,
              })}
            </Text>
            <br />
            <Text>
              <Link
                href="/downloads/pages/yps"
                isExternal
                color="blue.500"
                fontWeight="bold"
              >
                {getMessage({
                  ja: "誘導ポイント設定一覧表のダウンロードページ",
                  us: "Download page for induction point setting list",
                  cn: "感应点设置列表下载页面",
                  language,
                })}
              </Link>
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title={
            "2." +
            getMessage({
              ja: "本体のダウンロード",
              us: "Download the main unit",
              cn: "下载主机",
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
          <Text fontWeight="bold">
            {getMessage({
              ja: "下記のクリックで最新バージョンがダウンロードされます",
              us: "If it does not work correctly, do ",
              cn: "如果不能正常工作，请执行 ",
              language,
            })}
          </Text>
          <Box
            mt={2}
            w="5.5em"
            height="24px"
            border="1px solid"
            borderRadius="md"
            borderColor={
              colorMode === "light"
                ? "custom.theme.light.800"
                : "custom.theme.dark.100"
            }
            lineHeight="1"
            fontSize="inherit"
          >
            <DownloadButton
              currentUserName="a"
              url="/download/yps/yps"
              bg="custom.excel"
              color={colorMode === "light" ? "custom.theme.light.900" : "white"}
            />
          </Box>
        </SectionBox>
        <SectionBox
          id="section3"
          title={
            "3." +
            getMessage({
              ja: "ファイルの展開(解凍)",
              us: "File decompression (unzip)",
              cn: "提取（解压）文件",
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
          <Text fontWeight="bold">
            {getMessage({
              ja: "ダウンロードした.zipファイルを",
              us: "",
              cn: "",
              language,
            })}
            <UnzipModal />
            {getMessage({
              ja: "をしてください。",
              us: ".",
              cn: "。",
              language,
            })}
          </Text>

          <Text mt={6}>
            {getMessage({
              ja: "この解凍したファイルを利用する場所(通常はNASサーバー)に設置してください。",
              us: "",
              cn: "",
              language,
            })}
            <br />
            {getMessage({
              ja: "ファイル名を変更する場合は、先頭のYps*.**_は変更しないでください。バージョンアップ/アップロードができなくなります。",
              us: "",
              cn: "",
              language,
            })}
          </Text>
        </SectionBox>
        <SectionBox
          id="section4"
          title={
            "4." +
            getMessage({
              ja: "参照設定の確認",
              us: "Check reference settings",
              cn: "检查参考设置",
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
          <Text fontWeight="bold">
            {getMessage({
              ja: "ファイルを開いて",
              us: "If it does not work correctly, do ",
              cn: "如果不能正常工作，请执行 ",
              language,
            })}
            <ReferenceSettingModal />
            {getMessage({
              ja: "をしてください。",
              us: ".",
              cn: "。",
              language,
            })}
          </Text>

          <Text mt={6}>
            {getMessage({
              ja: "参照不可がある場合はその画面を「問い合わせ」から連絡をください。",
              us: 'If it is unreferenced, please send us the screen from the "Contact" chat.',
              cn: '如果屏幕没有参考资料，请通过 "联系" 聊天将其发送给我们。',
              language,
            })}
            <br />
            {getMessage({
              ja: "誘導ポイント設定一覧表では標準ライブラリしか使ってないので通常は参照不可は無いはずです。",
              us: "The induction point setting list uses only the standard library, so the unreferenced should not occur.",
              cn: "感应点设置列表只使用标准库，因此不应出现不引用的情况。",
              language,
            })}
          </Text>
        </SectionBox>
        <SectionBox
          id="section5"
          title={
            "5." +
            getMessage({
              ja: "設定",
              us: "",
              cn: "",
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
          <Text mt={2}>
            使用する為の設定を行います。これは初回だけで以降は必要ありません。
          </Text>
        </SectionBox>
        <Box ml={2}>
          <SectionBox
            id="section5_1"
            title={
              "5-1." +
              getMessage({
                ja: "サーバーの設定",
                us: "",
                cn: "",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
            mt="0"
          >
            <Divider
              my={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text fontWeight="bold">
              {getMessage({
                ja: "バージョンアップ/アップロード用のサーバーを設定します。",
                us: "",
                cn: "",
                language,
              })}
              {ipAddress}
            </Text>
            <Image src="/images/0010/0001.png" w="100%" mb={6} />
            <Text>
              {"1.ｲﾝﾗｲﾝ = " +
                getMessage({
                  ja: "作業に対応するLED番号を入力する列を指定",
                  us: "Specify the column to enter the LED number corresponding to the work",
                  cn: "指定在哪一列输入与任务相对应的 LED 编号",
                  language,
                })}
            </Text>
            <Text>
              {"2.start_ = " +
                getMessage({
                  ja: "製品品番の左端の列を指定",
                  us: "Specify the left-most column of the product part number",
                  cn: "指定产品部件编号的最左一列",
                  language,
                })}
            </Text>
            <Text>
              {"3.end_ = " +
                getMessage({
                  ja: "製品品番の右端の列を指定",
                  us: "Specify the rightmost column of the product part number",
                  cn: "指定产品部件号最右边一列",
                  language,
                })}
            </Text>
            <Text mt={2}>
              {getMessage({
                ja: "※実際には原紙を使うと思うので編集時に以上のルールを守るだけになると思います",
                us: "*I think I'll actually use the original paper, so I'll just follow the above rules when editing.",
                cn: "*我认为我们实际上会使用原稿，所以我们在编辑时只需遵循上述规则即可。",
                language,
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section5_2"
            title={
              "5-2." +
              getMessage({
                ja: "値の入力",
                us: "Enter a value",
                cn: "输入数值",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text fontWeight="bold">
              {getMessage({
                ja: "入力ルールは以下のようになります。",
                us: "The input rules are as follows",
                cn: "输入规则如下",
                language,
              })}
              <br />
              {getMessage({
                ja: "入力箇所のセル結合はしないてください。結合範囲のセルは左上しか認識できないので不具合の原因になります。",
                us: "Do not merge cells in the input area. The cells in the merged range can only be recognized in the upper left corner, which can cause problems.",
                cn: "不要合并输入区域中的单元格。合并范围内的单元格只能在左上角识别，这可能会造成问题。",
                language,
              })}
            </Text>
            <Image src="/images/0010/0002.png" w="100%" mb={6} />
            <Text>
              {"4." +
                getMessage({
                  ja: "ｲﾝﾗｲﾝ番号の入力 = 作業に対し光らせたいLED番号の入力",
                  us: "Enter inline number = enter the LED number you want to light up for your work",
                  cn: "输入内联编号 = 输入任务要点亮的 LED 编号。",
                  language,
                })}
              <br />
              {"4." +
                getMessage({
                  ja: "ｲﾝﾗｲﾝ色 = 複数のYICで作業をする場合は背景色を変える事で背景色毎の出力が可能",
                  us: "Inline color = If you are working with multiple YICs, you can change the background color to output each background color.",
                  cn: "内联颜色 = 使用多个 YIC 时，可更改背景颜色，以允许输出每种背景颜色。",
                  language,
                })}
            </Text>
            <Text>
              {"5." +
                getMessage({
                  ja: "YICの呼び出し番号 = 空欄の場合は出力しない",
                  us: "YIC call number = if blank, no output",
                  cn: "YIC 呼叫编号 = 空白时无输出",
                  language,
                })}
            </Text>
            <Text>
              {"6." +
                getMessage({
                  ja: "作業の有無 = 空欄の場合はLEDが光らない",
                  us: "Work = If left blank, LED will not light up",
                  cn: "工作 = 如果留空, LED 不亮。",
                  language,
                })}
            </Text>
          </SectionBox>
        </Box>
        <SectionBox
          id="section6"
          title={
            "6." +
            getMessage({
              ja: "データ入力",
              us: "data entry",
              cn: "数据输入",
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
          <Text fontWeight="bold"></Text>
          <Text mt={6}></Text>
        </SectionBox>
        <Box ml={2}>
          <SectionBox
            id="section6_1"
            title={
              "6-1." +
              getMessage({
                ja: "列の指定",
                us: "Specify columns",
                cn: "栏目名称",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
            mt="0"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text fontWeight="bold">
              {getMessage({
                ja: "下記の3項目を以下のルールで配置してください。それ以外は自由に編集が可能です。",
                us: "Please place the following three items according to the following rules. The rest can be freely edited.",
                cn: "以下三项应按以下规则放置。其余可自由编辑。",
                language,
              })}
            </Text>
            <Image src="/images/0010/0001.png" w="100%" mb={6} />
            <Text>
              {"1.ｲﾝﾗｲﾝ = " +
                getMessage({
                  ja: "作業に対応するLED番号を入力する列を指定",
                  us: "Specify the column to enter the LED number corresponding to the work",
                  cn: "指定在哪一列输入与任务相对应的 LED 编号",
                  language,
                })}
            </Text>
            <Text>
              {"2.start_ = " +
                getMessage({
                  ja: "製品品番の左端の列を指定",
                  us: "Specify the left-most column of the product part number",
                  cn: "指定产品部件编号的最左一列",
                  language,
                })}
            </Text>
            <Text>
              {"3.end_ = " +
                getMessage({
                  ja: "製品品番の右端の列を指定",
                  us: "Specify the rightmost column of the product part number",
                  cn: "指定产品部件号最右边一列",
                  language,
                })}
            </Text>
            <Text mt={2}>
              {getMessage({
                ja: "※実際には原紙を使うと思うので編集時に以上のルールを守るだけになると思います",
                us: "*I think I'll actually use the original paper, so I'll just follow the above rules when editing.",
                cn: "*我认为我们实际上会使用原稿，所以我们在编辑时只需遵循上述规则即可。",
                language,
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section6_2"
            title={
              "6-2." +
              getMessage({
                ja: "値の入力",
                us: "Enter a value",
                cn: "输入数值",
                language,
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider
              mt={2}
              borderColor={colorMode === "light" ? "black" : "white"}
            />
            <Text fontWeight="bold">
              {getMessage({
                ja: "入力ルールは以下のようになります。",
                us: "The input rules are as follows",
                cn: "输入规则如下",
                language,
              })}
              <br />
              {getMessage({
                ja: "入力箇所のセル結合はしないてください。結合範囲のセルは左上しか認識できないので不具合の原因になります。",
                us: "Do not merge cells in the input area. The cells in the merged range can only be recognized in the upper left corner, which can cause problems.",
                cn: "不要合并输入区域中的单元格。合并范围内的单元格只能在左上角识别，这可能会造成问题。",
                language,
              })}
            </Text>
            <Image src="/images/0010/0002.png" w="100%" mb={6} />
            <Text>
              {"4." +
                getMessage({
                  ja: "ｲﾝﾗｲﾝ番号の入力 = 作業に対し光らせたいLED番号の入力",
                  us: "Enter inline number = enter the LED number you want to light up for your work",
                  cn: "输入内联编号 = 输入任务要点亮的 LED 编号。",
                  language,
                })}
              <br />
              {"4." +
                getMessage({
                  ja: "ｲﾝﾗｲﾝ色 = 複数のYICで作業をする場合は背景色を変える事で背景色毎の出力が可能",
                  us: "Inline color = If you are working with multiple YICs, you can change the background color to output each background color.",
                  cn: "内联颜色 = 使用多个 YIC 时，可更改背景颜色，以允许输出每种背景颜色。",
                  language,
                })}
            </Text>
            <Text>
              {"5." +
                getMessage({
                  ja: "YICの呼び出し番号 = 空欄の場合は出力しない",
                  us: "YIC call number = if blank, no output",
                  cn: "YIC 呼叫编号 = 空白时无输出",
                  language,
                })}
            </Text>
            <Text>
              {"6." +
                getMessage({
                  ja: "作業の有無 = 空欄の場合はLEDが光らない",
                  us: "Work = If left blank, LED will not light up",
                  cn: "工作 = 如果留空, LED 不亮。",
                  language,
                })}
            </Text>
          </SectionBox>
        </Box>
        <SectionBox
          id="section7"
          title={
            "7." +
            getMessage({
              ja: "YICへの出力",
              us: "Output to YIC",
              cn: "输出至 YIC",
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
          <Text fontWeight="bold">
            {getMessage({
              ja: "MENUの説明",
              us: "Explanation of MENU",
              cn: "MENU 说明。",
              language,
            })}
          </Text>
          <Image src="/images/0010/0003.png" w="45%" mb={6} />

          <Text lineHeight={1.6}>
            {"①" +
              getMessage({
                ja: "48P、100P、200Pを選択",
                us: "Select 48P, 100P, or 200P",
                cn: "选择 48p、100p 或 200p",
                language,
              })}
            <br />
            {getMessage({
              ja: "※200Pは動作未確認です。不具合がある場合は連絡をお願いします。",
              us: "*200P has not been tested. Please contact us if there are any problems.",
              cn: "*200P 未经运行测试。如有任何问题，请联系我们。",
              language,
            })}
            <br />
            {"②" +
              getMessage({
                ja: "YICと接続したシリアルポート番号を選択。背景色が白になったら接続完了です。",
                us: "Select the serial port number connected to the YIC. When the background color turns white, the connection is complete.",
                cn: "选择与 YIC 连接的串行端口号。当背景颜色变白时，连接完成。",
                language,
              })}
            <br />
            {"③" +
              getMessage({
                ja: "ｲﾝﾗｲﾝ色の選択。",
                us: "Inline color selection.",
                cn: "内联颜色选择。",
                language,
              })}
            <br />
            {"④" +
              getMessage({
                ja: "チェックオンでYICに直接転送する。",
                us: "Check on to transfer directly to YIC.",
                cn: "接通后直接转入青年信息中心。",
                language,
              })}
            <br />
            {"⑤" +
              getMessage({
                ja: "チェックオンでインラインクリップ設定一覧表のシートを作成する。",
                us: "Check on to create an inline clip settings list sheet.",
                cn: "选中以创建内联剪辑设置列表表。",
                language,
              })}
            <br />
            {getMessage({
              ja: "※作成したシートからも出力可能です。",
              us: "*Output is also possible from sheets that have been created.",
              cn: "*也可从已创建的工作表中输出。",
              language,
            })}
            <br />
            {"⑥" +
              getMessage({
                ja: "④または⑤を実行します。",
                us: "Perform ④ or ⑤.",
                cn: "④ 或 ⑤。",
                language,
              })}
            <br />
            {"⑦" +
              getMessage({
                ja: "このブックに含まれるバージョンをアップロード。",
                us: "Upload the version contained in this book.",
                cn: "本书包含的上传版本。",
                language,
              })}
            <br />
            {"⑧" +
              getMessage({
                ja: "カレントディレクトリ以下のサブディレクトリのファイル名が「誘導ポイント設定一覧表」を含むブックに対して⑦のプログラムを与えます",
                us: 'Give the program ⑦ to the book whose file name contains "Guidance Point Setting List" in the subdirectory under the current directory',
                cn: '程序 ⑦ 给出的是一本书，其当前目录下子目录中的文件名包含 "引导点设置列表"。',
                language,
              })}
          </Text>
        </SectionBox>
        <SectionBox
          id="section7"
          title={
            "7." +
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
              lineHeight={1.6}
            >
              {getMessage({
                ja: "このシステムは実際に運用中ですが、未完成で以下の問題を含んでいます。",
                us: "This system is actually in operation, but it is incomplete and contains the following problems",
                cn: "该系统已实际运行，但并不完整，存在以下问题",
                language,
              })}
              <br />
              <br />
              {"1." +
                getMessage({
                  ja: "200Pは運用中の工場での保有が無いので動作は未確認です。",
                  us: "The 200P has not been held at the factory in operation, so its operation has not been tested.",
                  cn: "由于 200P 出厂时未进行运行测试。",
                  language,
                })}
              <br />
              {"2." +
                getMessage({
                  ja: "ポイント72と73が反対になる(LED72を指示をしても73が光る)不具合が発生しています。",
                  us: "There is a problem with points 72 and 73 being opposite (LED 72 is indicated but 73 glows).",
                  cn: "有一个问题是 72 和 73 点相反（LED 72 指示灯亮，但 73 点亮）。",
                  language,
                })}
              <br />
              {getMessage({
                ja: "※おそらく書き込み器側の不具合なのですが解決する方法が無いのでオプションで「入れ替える」機能の追加を予定しています。",
                us: '*This is probably a glitch on the burner side, but there is no way to solve it, so we are planning to add an optional "replace" function.',
                cn: '*这可能是刻录机方面的故障，但没有办法解决，因此我们计划添加一个可选的 "替换" 功能。',
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
