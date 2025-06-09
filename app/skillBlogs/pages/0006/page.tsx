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
  Flex,
  Tooltip,
  Icon,
  createIcon,
  Spacer,
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { LuPanelRightOpen } from "react-icons/lu";
import Content from "@/components/content";
import { useColorMode } from "@chakra-ui/react";
import { useCustomToast } from "@/components/ui/customToast";
import SectionBox from "../../components/SectionBox";
import BasicDrawer from "@/components/ui/BasicDrawer";
import Frame from "../../components/frame";
import { useDisclosure } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CustomBadge } from "@/components/ui/CustomBadge";
import UnderlinedTextWithDrawer from "../../components/UnderlinedTextWithDrawer";
import IframeDisplay from "../../components/IframeDisplay";
import { useUserContext } from "@/contexts/useUserContext";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import { AnimationImage } from "@/components/ui/CustomImage";

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
              })}
            </Text>
          </HStack>
          <Heading fontSize="3xl" mb={1}>
            {getMessage({
              ja: "生産準備+とは",
              us: "What is Production Preparation+?",
              cn: "什么是生产准备+？",
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
            })}
            :2024-11-20
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
                ja: "ワイヤーハーネスの品番切替には多くの時間が掛かります。特に従来のハメ図から写真のハメ図に置き換えるのが大変です。そこで、より効率良くハメ図を作成するシステムを作成しました。その後、現場の意見を聞きながら更新を続けています。",
                us: "Switching wiring harness part numbers takes a lot of time. It is especially difficult to replace the conventional framing diagram with a photo framing diagram. Therefore, we created a system to create framing diagrams more efficiently. Since then, we have continued to update the system while listening to opinions from the field.",
                cn: "转换线束零件编号需要花费大量时间。用照片框架图取代传统的框架图尤其困难。因此，我们创建了一个系统来更高效地创建框架图。从那时起，我们在听取现场反馈意见的同时不断更新系统。",
              })}
            </Text>
          </Box>
        </SectionBox>
        <SectionBox
          id="section2"
          title={
            "2." +
            getMessage({
              ja: "できること",
              us: "What you can do.",
              cn: "你能做什么",
            })
          }
          sectionRefs={sectionRefs}
          sections={sections}
        >
          <Divider
            mt={2}
            borderColor={colorMode === "light" ? "black" : "white"}
          />
          <video width="100%" height="100%" loop autoPlay muted>
            <source src="/images/0006/SjpPromotion.mp4" type="video/mp4" />
            {getMessage({
              ja: "お使いのブラウザは動画タグをサポートしていません",
            })}
          </video>
        </SectionBox>
        <Box m={3}>
          <SectionBox
            id="section2_1"
            title={
              "2-1." +
              getMessage({
                ja: "コネクタ写真の共用",
                us: "Connector photo sharing",
                cn: "共同使用连接器照片",
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              {getMessage({
                ja: "誰かが撮影したコネクタ写真を使いまわせたら便利ですよね。ということでその仕組みを作りました。",
                us: "It would be convenient if we could use connector photos taken by someone else. That is why we created this system.",
                cn: "如果我们能使用别人拍摄的连接器照片，那就更方便了。这就是我们创建该系统的原因。",
              })}
            </Text>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Box bg="gray.300" color="black" w="80%" p={1}>
                {getMessage({
                  ja: "登録済みのコネクタデータは共用します",
                  us: "Registered connector data is shared.",
                  cn: "共享注册连接器数据",
                })}
              </Box>
              <Image src="/images/0006/0001.svg" w="80%" />
              <Text ml={4}>
                {getMessage({
                  ja: "2024/11/19時点で1680点が登録済みです。",
                  us: "As of 2024/11/19, 1680 items have been registered.",
                  cn: "截至 2024 年 11 月 19 日，共登记了 1680 个项目。",
                })}
              </Text>
            </Flex>
          </SectionBox>
          <SectionBox
            id="section2_2"
            title={
              "2-2." +
              getMessage({
                ja: "ハメ図の作成",
                us: "Creating a frame diagram",
                cn: "创建框架图",
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text>
              {getMessage({
                ja: "写真のハメ図を作るのが大変だから何とかしてほしい。という意見を受けて作成しました。",
                us: "It is very difficult to make a photo framing diagram, so please do something about it. We created this chart in response to the feedback from our customers.",
                cn: "制作照片取景图非常困难，请大家想想办法。这是针对以下意见制作的。",
              })}
            </Text>
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="center"
              wrap="wrap"
              maxWidth="100%"
              gap={4}
            >
              <Tooltip
                label={getMessage({
                  ja: "通常のハメ図です。詰栓や先ハメ付属部品はこのように表示されます。",
                  us: "This is a normal framing diagram. Jammed plugs and tip-framed accessory parts are shown like this.",
                  cn: "正常框架图。被卡住的插头和被尖端卡住的配件都以这种方式表示。",
                })}
                placement="top"
              >
                <Image
                  src="/images/0006/1_150_all.png"
                  width="55%"
                  alt="1_150_all.png"
                  mb={{ base: 4, md: 0 }}
                />
              </Tooltip>
              <Tooltip
                label={getMessage({
                  ja: "ボンダーは線長順で表示され各行き先の端末No.が分かるようになっています。",
                  us: "The bonders are displayed in order of line length and the terminal No. of each destination.",
                  cn: "转发器按线路长度顺序显示，并显示每个目的地的终端编号。",
                })}
                placement="top"
              >
                <Image
                  src="/images/0006/1_434_all.png"
                  alt="1_434_all.png"
                  maxWidth="37%"
                  mb={{ base: 4, md: 0 }}
                />
              </Tooltip>
            </Flex>
            <Text ml={6}>
              {getMessage({
                ja: "拠点によって要望が違うので",
                us: "We have",
                cn: "不同的地点有不同的要求",
              })}
              <UnderlinedTextWithDrawer
                text=<>
                  <Box as="span" display="inline" borderBottom="2px solid">
                    {getMessage({
                      ja: " 選択式 ",
                      us: " selective ",
                      cn: " 选择性 ",
                    })}
                  </Box>
                  <LuPanelRightOpen
                    size="20px"
                    style={{ marginBottom: "-5px", display: "inline" }}
                  />
                </>
                onOpen={() => handleOpen("ハメ図は選択式")}
                isOpen={isOpen && activeDrawer === "ハメ図は選択式"}
                onClose={handleClose}
                header={getMessage({
                  ja: "ハメ図は選択式",
                  us: "framing diagram is selective.",
                  cn: "框架图具有选择性",
                })}
                size="sm"
                children={
                  <Box>
                    <video width="100%" height="100%" loop autoPlay muted>
                      <source
                        src="/images/0006/selectSjpMenu.mp4"
                        type="video/mp4"
                      />
                      {getMessage({
                        ja: "お使いのブラウザは動画タグをサポートしていません",
                      })}
                    </video>
                    <Text mt={4}>
                      {getMessage({
                        ja: "作成メニューで選択して作成します",
                        us: "Select in the Create menu to create",
                        cn: "在创建菜单中选择创建",
                      })}
                    </Text>
                    <Text mt={4}>
                      {getMessage({
                        ja: "組み合わせパターンは ",
                        us: "The combination pattern is ",
                        cn: "组合模式是 ",
                      })}
                      <span style={{ fontWeight: "600" }}>52920</span>
                      <br />
                      (2024/11/20
                      {getMessage({
                        ja: "現在)",
                        us: "present)",
                        cn: "出席)",
                      })}
                    </Text>
                    <Text fontWeight="600" mt={4}>
                      {getMessage({
                        ja: "ポイント",
                        us: "pivot",
                        cn: "要点",
                      })}
                    </Text>
                    <Text>
                      {getMessage({
                        ja: "工場毎で需要が異なる為、選択式にしました。",
                        us: "Since demand differs from plant to plant, we have made it a selective system.",
                        cn: "由于各工厂的需求不同，该系统具有选择性。",
                      })}
                    </Text>
                  </Box>
                }
              />
              {getMessage({
                ja: "で作成できるようにしています。",
                us: "because different bases have different requirements.",
                cn: "。",
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section2_3"
            title={
              "2-3." +
              getMessage({
                ja: "サブ図",
                us: "subfigure",
                cn: "子图",
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              {getMessage({
                ja: "生産準備+の今の状態をサブ図として出力します。",
                us: "Outputs the current state of Production Preparation+ as a sub-diagram.",
                cn: "生产准备+ 的当前状态以子图形式输出。",
              })}
            </Text>
            <Image
              src="/images/0006/sub0001.png"
              width="100%"
              alt="4_516_all.png"
              mb={{ base: 4, md: 0 }}
            />
            <Text>
              {getMessage({
                ja: "他にも以下が作成されます",
                us: "The following others will be created",
                cn: "其他创建者",
              })}
              <br />
              {getMessage({
                ja: "#先ハメリスト",
                us: "#Pre-insertion list",
                cn: "#前插列表",
              })}
              <br />
              {getMessage({
                ja: "#後ハメリスト",
                us: "#Post-insertion list",
                cn: "#后插列表",
              })}
              <br />
              {getMessage({
                ja: "#サブサンプルに付けるタグ",
                us: "#Tags for sub-samples",
                cn: "#子样本的标签",
              })}
              <br />
              {getMessage({
                ja: "#電線チェックリスト",
                us: "#Wire checklist",
                cn: "#电线检查表",
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section2_4"
            title={
              "2-4." +
              getMessage({
                ja: "共通ハメ図の作成",
                us: "Creation of common frame diagram",
                cn: "编制通用框架图",
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              {getMessage({
                ja: "これ!!ハメ図より作成/更新するのが大変ですよね。開発にも苦労しました。",
                us: "THIS!!! It's a lot harder to create/update than a framing diagram. It was also hard to develop.",
                cn: "这个比框架图更难创建/更新。也很难开发。",
              })}
            </Text>
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="center"
              wrap="wrap"
              maxWidth="100%"
              gap={4}
            >
              <Tooltip
                label={getMessage({
                  ja: "製品品番220のハメ図",
                  us: "Frame diagram of product part number 220",
                  cn: "产品部件号 220 的框架图。",
                })}
                placement="top"
              >
                <Image
                  src="/images/0006/4_516_all.png"
                  width="45%"
                  alt="4_516_all.png"
                  mb={{ base: 4, md: 0 }}
                />
              </Tooltip>
              <Tooltip
                label={getMessage({
                  ja: "製品品番310/131のハメ図",
                  us: "Frame diagram of product part number 310/131",
                  cn: "产品部件号 310/131 的框架图",
                })}
                placement="top"
              >
                <Image
                  src="/images/0006/3_516_all.png"
                  maxWidth="42%"
                  alt="3_516_all.png"
                  mb={{ base: 4, md: 0 }}
                />
              </Tooltip>
            </Flex>
            <Text ml={6} mt={4}>
              {getMessage({
                ja: "ハメ図を ",
                us: "Effective when the space to put up a frame diagram is ",
                cn: "当 ",
              })}
              <UnderlinedTextWithDrawer
                text=<>
                  <Box as="span" display="inline" borderBottom="2px solid">
                    {getMessage({
                      ja: "貼るスペースが狭い",
                      us: "small",
                      cn: "粘贴框架图的空间太小",
                    })}
                  </Box>
                  <LuPanelRightOpen
                    size="20px"
                    style={{ marginBottom: "-5px", display: "inline" }}
                  />
                </>
                onOpen={() => handleOpen("ハメ図の共通化")}
                isOpen={isOpen && activeDrawer === "ハメ図の共通化"}
                onClose={handleClose}
                header={getMessage({
                  ja: "ハメ図の共通化",
                  us: "Commonization of Frame Diagrams",
                  cn: "框架图的通用化",
                })}
                children={
                  <Box>
                    <Image
                      src="/images/0006/commonPicture.jpeg"
                      maxWidth="100%"
                      alt="commonPicture.png"
                    />
                    <Text mt={4}>
                      {getMessage({
                        ja: "上図のように狭いスペースで使う場合には共通化が有効です。ですが手動で作成/更新するには時間が掛かりすぎる為、この機能を追加しました。",
                        us: "Commonization is effective when used in a small space as shown in the figure above. However, it takes too much time to create/update manually, so we added this function.",
                        cn: "如上图所示，在狭小空间内使用通用化功能非常有效。不过，手动创建/更新过于耗时，因此增加了这一功能。",
                      })}
                    </Text>
                  </Box>
                }
              />
              {getMessage({
                ja: "場合に有効です",
                us: ".",
                cn: "时有效。",
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section2_5"
            title={
              "2-5." +
              getMessage({
                ja: "サブナンバーの印刷",
                us: "Printing sub-numbers",
                cn: "打印小编号",
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text>
              {getMessage({
                ja: "生産準備+で決めたサブナンバーをエフに印刷します。",
                us: "Print the sub-numbers determined in Production Preparation+ on the eff.",
                cn: "在生产准备+ 中确定的子编号印在 EEF 上。",
              })}
            </Text>
            <Flex
              align="center"
              justify="center"
              wrap="wrap"
              maxWidth="100%"
              gap={4}
            >
              <Image
                my={4}
                src="/images/0006/0002.svg"
                maxWidth="100%"
                alt="0002.svg"
              />
              <Image
                src="/images/0006/printF1.png"
                maxWidth="90%"
                alt="printF1.png"
                mb={{ base: 4, md: 0 }}
              />
              <Text>
                {getMessage({
                  ja: "※印刷システムが対応していない場合は1時間程度の修正が必要です",
                  us: "*If the printing system does not support this, a correction of about 1 hour is required.",
                  cn: "*如果打印系统不兼容，则需要进行一小时的校正。",
                })}
              </Text>
            </Flex>
          </SectionBox>
          <SectionBox
            id="section2_6"
            title={
              "2-6." +
              getMessage({
                ja: "ポイントナンバー点滅",
                us: "Point number flashing",
                cn: "点编号闪烁",
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text>
              {getMessage({
                ja: "検査履歴システム(瀬戸内部品開発)用のポイントナンバー点滅が作成可能。",
                us: "Point number flashing can be created for the inspection history system (Setouchi parts development).",
                cn: "可为检查历史系统（内陆零件开发）创建闪烁点编号。",
              })}
            </Text>
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="center"
              wrap="wrap"
              maxWidth="100%"
              gap={4}
              mt={4}
            >
              <IframeDisplay
                src="/html/Sjp/70/8211158A40/0080.html"
                width="240"
                height="300"
              />
              <IframeDisplay
                src="/html/Sjp/70/8211158A40/0022.html"
                width="240"
                height="300"
              />
            </Flex>
          </SectionBox>
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Text mt={4}>
              {getMessage({
                ja: "現在は主に下記で使用しています",
                us: "Currently used primarily in the following",
                cn: "目前主要用于",
              })}
            </Text>
            <UnderlinedTextWithDrawer
              text=<>
                <Box as="span" display="inline" borderBottom="2px solid">
                  {"#1." +
                    getMessage({
                      ja: "検査履歴システム",
                    })}
                </Box>
                <LuPanelRightOpen
                  size="20px"
                  style={{ marginBottom: "-5px", display: "inline" }}
                />
              </>
              onOpen={() => handleOpen("検査履歴システム")}
              isOpen={isOpen && activeDrawer === "検査履歴システム"}
              onClose={handleClose}
              header={getMessage({
                ja: "検査履歴システム",
              })}
              size="sm"
              children={
                <Box>
                  <video width="100%" height="100%" loop autoPlay muted>
                    <source
                      src="/images/0006/検査履歴システム用ポイント図.mp4"
                      type="video/mp4"
                    />
                    {getMessage({
                      ja: "お使いのブラウザは動画タグをサポートしていません",
                    })}
                  </video>
                  <Text mt={4}>©︎瀬戸内部品</Text>
                  <Text>
                    {getMessage({
                      ja: "YCCに接続して検査状況を監視/検査履歴を記録するシステム。ラベル印刷に対応。QRリーダー(シリアル通信タイプ)が必要。",
                      us: "System to connect to YCC to monitor inspection status/record inspection history. Supports label printing; requires QR reader (serial communication type).",
                      cn: "系统与 YCC 连接，用于监控检测状态/记录检测历史。支持标签打印；需要 QR 阅读器（串行通信类型）。",
                    })}
                  </Text>
                  <Text mt={4}>
                    {getMessage({
                      ja: "上記でOPEN/SHORTが発生した場合の画面を生産準備+が作成。",
                      us: "Production Preparation+ creates a screen when OPEN/SHORT occurs in the above.",
                      cn: "生产准备+ 在上述情况下出现 OPEN/SHORT 时创建了一个屏幕。",
                    })}
                  </Text>
                  <Text mt={4}>
                    {getMessage({
                      ja: "検査履歴システムはこのWEBサイトでのダウンロード不可です。",
                      us: "The inspection history system is not available for download on this web site.",
                      cn: "检查记录系统无法在本网站上下载。",
                    })}
                  </Text>
                </Box>
              }
            />
          </Flex>
          <SectionBox
            id="section2_7"
            title={
              "2-7." +
              getMessage({
                ja: "配策誘導ナビ",
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text>
              {getMessage({
                ja: "配策作業は慣れた製品じゃないと端末を探すのが大変ですよね。なのでその経路が分かるものを作成しました。試作品や補給品などの非量産品に特に有効です。",
                us: "It's hard to find a terminal for the distribution process unless you are familiar with the product. Therefore, we have created something that shows that route. This is especially useful for non-mass-produced products such as prototypes and supplies.",
                cn: "如果不熟悉产品，就很难找到分销业务的终端。因此，我们创建了一个可以显示该路线的东西。这对于非批量生产的产品（如原型和供应品）尤其有用。",
              })}
            </Text>
            <Box display="flex" justifyContent="center" width="100%" mt={4}>
              <video width="70%" height="100%" loop autoPlay muted>
                <source src="/images/0006/0084.mp4" type="video/mp4" />
                {getMessage({
                  ja: "お使いのブラウザは動画タグをサポートしていません",
                })}
              </video>
            </Box>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Text mt={4}>
                {getMessage({
                  ja: "現在は主に下記で使用しています",
                  us: "Currently used primarily in the following",
                  cn: "目前主要用于",
                })}
              </Text>
              <UnderlinedTextWithDrawer
                text=<>
                  <Box as="span" display="inline" borderBottom="2px solid">
                    {"#1." +
                      getMessage({
                        ja: "配策誘導ナビ",
                      })}
                  </Box>
                  <LuPanelRightOpen
                    size="20px"
                    style={{ marginBottom: "-5px", display: "inline" }}
                  />
                </>
                onOpen={() => handleOpen("配策誘導ナビ")}
                isOpen={isOpen && activeDrawer === "配策誘導ナビ"}
                onClose={handleClose}
                header={getMessage({
                  ja: "配策誘導ナビとは",
                  us: "What is the Guidance Navigation System?",
                  cn: "什么是配送引导导航系统？",
                })}
                children={
                  <Box>
                    <Text mt={4}>
                      {getMessage({
                        ja: "配策誘導ナビ",
                      })}
                    </Text>
                    <Text>
                      {getMessage({
                        ja: "配策誘導を使用する結き工程で使用",
                        us: "Used in the tethering process with guided routing",
                        cn: "用于使用分配感应的接经工艺。",
                      })}
                    </Text>
                    <Text mt={4}>
                      {getMessage({
                        ja: "結き治具は横幅が長い為、通常のディスプレイでは作業者は見えません。なので移動させるようにしました。",
                        us: "Because of the long width of the tying jig, the operator cannot see it on a normal display. Therefore, it is moved.",
                        cn: "接经夹具横向很长，操作员无法在正常显示屏上看到它。因此，必须移动它。",
                      })}
                    </Text>
                    <Text mt={4}>
                      {getMessage({
                        ja: "キーボード入力タイプのQRリーダーが必要",
                        us: "Requires a keyboard input type QR reader",
                        cn: "需要键盘输入类型的 QR 阅读器。",
                      })}
                      <br />
                      {getMessage({
                        ja: "ディスプレイを移動させる為にVB.netのシリアルコントロールを利用。",
                        us: "Using VB.net serial control to move the display.",
                        cn: "使用 VB.net 串行控件移动显示屏。",
                      })}
                    </Text>
                  </Box>
                }
              />
              <UnderlinedTextWithDrawer
                text=<>
                  <Box as="span" display="inline" borderBottom="2px solid">
                    {"#2." +
                      getMessage({
                        ja: "配策誘導ナビv3.1(モバイル)",
                        us: "Guidance Navigation v3.1 (Mobile)",
                        cn: "作业指导导航 v3.1（移动版）",
                      })}
                  </Box>
                  <LuPanelRightOpen
                    size="20px"
                    style={{ marginBottom: "-5px", display: "inline" }}
                  />
                </>
                onOpen={() => handleOpen("配策誘導ナビモバイル")}
                isOpen={isOpen && activeDrawer === "配策誘導ナビモバイル"}
                onClose={handleClose}
                header={getMessage({
                  ja: "配策誘導ナビv3.1(モバイル)とは",
                  us: "What is Assignment Guidance Navigation v3.1 (Mobile)?",
                  cn: "导航 v3.1（移动版）的战略指导是什么？",
                })}
                size="xl"
                children={
                  <Box>
                    <IframeDisplay src="/56v3.1_" width="100%" />
                    <Text mt={4}></Text>
                    <Text>
                      {getMessage({
                        ja: "配策誘導をタッチ操作に対応してiPadのようなモバイル端末でも操作できるようにしました。上の画面をタッチ/クリックしてみてください。",
                        us: "We have made the allocation guidance compatible with touch operation so that it can be operated on mobile devices such as the iPad. Please touch/click on the screen above.",
                        cn: "分配指南现在支持触摸，因此可以在 iPad 等移动设备上操作。触摸/点击上面的屏幕。",
                      })}
                    </Text>
                    <Text>
                      {getMessage({
                        ja: "現在は表示のみですが、サブ形態の変更などの機能拡張が見込めます。",
                        us: "Currently, it is only for display, but we expect to expand the functionality, such as changing the sub form.",
                        cn: "目前，它仅用于显示，但预计会进行功能扩展，例如更改子表单。",
                      })}
                    </Text>
                    <Text mt={4}>
                      {getMessage({
                        ja: "モバイル端末からアクセスするには別途WEBサーバーが必要。",
                        us: "A separate web server is required for access from mobile devices.",
                        cn: "从移动设备访问需要单独的网络服务器。",
                      })}
                      <br />
                      {getMessage({
                        ja: "WEBサーバーの値段は1万円-500万円(20万円弱がお勧めです)",
                        us: "The price of a web server is 10,000 yen - 5,000,000 yen (less than 200,000 yen is recommended)",
                        cn: "网络服务器的价格为 10,000 - 5,000,000 日元（建议低于 200,000 日元）。",
                      })}
                    </Text>
                  </Box>
                }
              />
            </Flex>
          </SectionBox>
          <SectionBox
            id="section2_8"
            title={
              "2-8." +
              getMessage({
                ja: "MKEDへの回路符号入力",
                us: "Circuit code input to MKED",
                cn: "输入 MKED 的电路代码",
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text>
              {getMessage({
                ja: "チェッカー用データ作成で回路符号の入力。",
                us: "Input of circuit code in the creation of data for the checker.",
                cn: "在为校验器创建数据时输入电路代码。",
              })}
            </Text>
            <Box display="flex" justifyContent="center" width="100%" mt={4}>
              <video width="70%" height="100%" loop autoPlay muted>
                <source src="/images/0006/v4220.mp4" type="video/mp4" />
                {getMessage({
                  ja: "お使いのブラウザは動画タグをサポートしていません",
                })}
              </video>
            </Box>
          </SectionBox>
          <SectionBox
            id="section2_9"
            title={
              "2-9." +
              getMessage({
                ja: "竿レイアウト(AMDAS作成)",
                us: "Rod layout (created by AMDAS)",
                cn: "电线杆布局（由 AMDAS 创建）",
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              {getMessage({
                ja: "AMDASデータの作成は時間がかかるし入力ミスが発生しますよね。下記のように効率良く作成する方法を作成しました。",
                us: "Creating AMDAS data is time consuming and input errors can occur. We have created the following method to create the data efficiently.",
                cn: "创建 AMDAS 数据非常耗时，而且可能出现输入错误。我们创建了创建以下数据的有效方法。",
              })}
            </Text>
            <Image src="/images/0006/0003.svg" width="100%" alt="0003.svg" />
            <Text>
              {getMessage({
                ja: "これは使用頻度が低い為、作り込みがあまり出来ていません。不具合があれば連絡下さい。",
                us: "This is not very well built due to infrequent use. Please contact us if you find any problems.",
                cn: "由于不经常使用，因此做工不是很好。如有任何问题，请联系我们。",
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section2_10"
            title={
              "2-10." +
              getMessage({
                ja: "サブナンバー引越し",
                us: "sub-number move",
                cn: "子编号移动",
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              {getMessage({
                ja: "特にマイナーチェンジ時はサブ形態が引き継がれる事が多いと思います。その際に旧→新にサブナンバーを引っ越す事が可能です",
                us: "I believe that the sub form is often transferred over, especially during minor changes. It is possible to move the sub-number from old to new at that time",
                cn: "特别是在进行微小改动时，子编号往往会被转移过来。这时可以将子编号从旧编号移到新编号上",
              })}
            </Text>
            <Image src="/images/0005/0001.svg" width="100%" alt="0001.svg" />
            <Image
              src="/images/0005/new_menu3.png"
              width="100%"
              alt="new_menu3.png"
              mt={4}
            />
            <Text>
              {getMessage({
                ja: "上図は82111V4662のみ引越しを実行した結果です。",
                us: "The above figure shows the result of executing the move only for 82111V4662.",
                cn: "上图显示了仅对 82111V4662 执行移动的结果。",
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section2_11"
            title={
              "2-11." +
              getMessage({
                ja: "バージョンアップ",
                us: "version upgrade",
                cn: "版本升级",
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
            <Text>
              {getMessage({
                ja: "生産準備+は日に1回程度の更新をしています。通常は新しいコードに手修正するのに10分くらいかかります。生産準備+の数は治具台数と等しい為、手修正が現実的ではありません。そこでバージョンアップ機能を追加しました。4クリックで完了します。",
                us: "Production Preparation+ is updated about once a day. It usually takes about 10 minutes to manually modify it to the new code. Since the number of Production Preparation+ is equal to the number of fixtures, manual modification is not practical. Therefore, we have added an upgrade function, which can be completed in 4 clicks.",
                cn: "生产准备+ 大约每天更新一次。手动将其修改为新代码通常需要 10 分钟左右。由于生产准备+ 的数量等同于夹具的数量，手动修改并不现实。因此，我们增加了升级功能，只需点击四下即可完成。",
              })}
            </Text>
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                my={4}
                src="/images/0006/0004.svg"
                width="50%"
                alt="0004.svg"
              />
              <Image
                my={4}
                src="/images/0006/verup_.svg"
                width="45%"
                alt="verup_.svg"
              />
            </Flex>
            <Text></Text>
          </SectionBox>
          <SectionBox
            id="section2_12"
            title={
              "2-12." +
              getMessage({
                ja: "その他",
                us: "Other",
                cn: "其他",
              })
            }
            sectionRefs={sectionRefs}
            sections={sections}
            size="sm"
          >
            <Divider borderColor={colorMode === "light" ? "black" : "white"} />
            <Text mb={4}>
              {getMessage({
                ja: "他にも以下のようにできることはありますが、説明は未だ作れていません。",
                us: "There are other things that can be done as follows, but explanations have not yet been created.",
                cn: "还可以做以下其他事情，但尚未做出解释。",
              })}
            </Text>
            <Text>
              {"#" +
                getMessage({
                  ja: "先ハメ誘導ナビ",
                })}
            </Text>
            <Text>
              {"#" +
                getMessage({
                  ja: "部品箱の表示作成(TEPRA)",
                  us: "Creation of parts box display (TEPRA)",
                  cn: "创建零件箱显示器（TEPRA）。",
                })}
            </Text>
            <Text>
              {"#" +
                getMessage({
                  ja: "電線仕分け表",
                  us: "wire sorting table",
                  cn: "分线台",
                })}
            </Text>
            <Text>
              {"#" +
                getMessage({
                  ja: "サブリスト",
                  us: "sublist",
                  cn: "子列表",
                })}
            </Text>
            <Text>
              {"#" +
                getMessage({
                  ja: "EXTESからの共通化分析リクエストの実行",
                  us: "Execution of Commonality Analysis Request from EXTES",
                  cn: "执行 EXTES 提出的通用化分析要求",
                })}
            </Text>
            <Text>
              {"#" +
                getMessage({
                  ja: "サブ自動立案",
                  us: "subautomatic drafting",
                  cn: "次自动起草",
                })}
            </Text>
            <Text textAlign="center">
              {getMessage({
                ja: "--作成途中--",
                us: "--on the way--",
                cn: "--作成途中--",
              })}
            </Text>
          </SectionBox>
        </Box>

        <SectionBox
          id="section3"
          title={
            "3." +
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
            pb={10}
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
                fontWeight: "200",
              }}
            >
              {getMessage({
                ja: "現場の意見を基に相談しながら新しい機能を追加しています。何かアイデアや要望があればメニューの問い合わせから相談下さい。アカウントが未作成の場合は開発のチャットからメッセージください。",
                us: "We are adding new features based on feedback from the field in consultation with you. If you have any ideas or requests, please contact us from the menu. If you have not created an account yet, please send us a message from the development chat.",
                cn: "新功能会根据现场反馈意见进行协商添加。如果您有任何想法或要求，请咨询菜单联系人。如果您尚未创建账户，请通过开发聊天给我们留言。",
              })}
            </Text>
            <AnimationImage
              src="/images/hippo.gif"
              width="50px"
              right="-10px"
              bottom="-18px"
              animation="nyoki_rabit 5s forwards, rabitJump 10s infinite 7s"
            />
          </Box>
        </SectionBox>
      </Frame>
    </>
  );
};

export default BlogPage;
