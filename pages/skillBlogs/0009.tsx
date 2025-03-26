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
import ExternalLink from "./ExternalLink";
import { FileSystemNode } from "../../components/fileSystemNode"; // FileSystemNode コンポーネントをインポート
import ImageSliderModal from "./ImageSliderModal"; // モーダルコンポーネントをインポート
import ReferenceSettingModal from "./referenceSettingModal";
import { useUserContext } from "../../context/useUserContext";
import { useReadCount } from "../../hooks/useReadCount";

import { BsFiletypeExe } from "react-icons/bs";
import SjpChart01 from "./chart/chart_0009_01";
import SjpChart02 from "./chart/chart_0009_02";

import { useLanguage } from "../../context/LanguageContext";
import getMessage from "../../components/getMessage";

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
  const [showConfetti, setShowConfetti] = useState(false); // useStateをコンポーネント内に移動
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // onOpenを追加

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
              ja: "導入の効果",
              us: "Effects of Introduction",
              cn: "引进的影响",
              language,
            })}
          </Heading>
          <CustomBadge
            text={getMessage({
              ja: "生準+",
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
            :2024-11-27
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
                ja: "生産準備+は相乗的に効果を発揮するので説明が難しいですが、頑張って書いてみます",
                us: "Production Preparation+ is difficult to explain because it works synergistically, but I'll do my best to write it down!",
                cn: "生产准备+ 很难解释，因为它是协同作用的，但我会尽力写下来！",
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
              ja: "生産準備への効果",
              us: "Effect on production readiness",
              cn: "对生产准备的影响。",
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
              ja: "生産準備では新規立上げ/切替時に多くの成果物を作成すると思います。しかも必ず発生する設計変更などにより作り直しも必要になってきます。その結果、多くの時間が掛かり作成ミスも多くなりがちで不良の原因にもなっていました。そこでより効率的に作成/管理できる方法を考えてみました。",
              us: "In production preparation, many deliverables are created at the time of new start-up/switchover. In addition, design changes that are bound to occur require rework. As a result, it takes a lot of time and tends to cause many creation errors, which also leads to defects. Therefore, we have come up with a more efficient way to create and manage the work.",
              cn: "在生产准备过程中，新机启动/切换时会产生大量的可交付成果。此外，设计变更不可避免地会发生，这就需要返工。因此，这需要花费大量时间，而且往往会出现大量创建错误，这也会造成缺陷。因此，我们考虑采用一种更有效的方法来创建/管理它们。",
              language,
            })}
          </Text>
          <Text mt={6}>
            {getMessage({
              ja: "下記の条件で導入効果を見ていきます",
              us: "We will look at the effects of introduction under the following conditions",
              cn: "我们将研究在以下条件下引入的效果",
              language,
            })}
          </Text>
          <VStack justifyContent="center" mt={4} spacing={0}>
            <Box
              borderTop="1px solid"
              borderRight="1px solid"
              borderLeft="1px solid"
              borderTopRadius={5}
              p={1}
              textAlign="center"
              bg="gray.300"
              w="60%"
            >
              {getMessage({
                ja: "2018年_エンジンメイン(平均約550回路)",
                us: "2018_Engine main (average about 550 circuits)",
                cn: "2018_发动机主电路（平均约 550 个电路）。",
                language,
              })}
            </Box>
            <Box border="1px solid" borderBottomRadius={5} p={2} mb={4} w="60%">
              <Text>
                {"・" +
                  getMessage({
                    ja: "新規立ち上げ",
                    us: "starting anew",
                    cn: "创业",
                    language,
                  })}
              </Text>

              <Text>
                {"・" +
                  getMessage({
                    ja: "担当は5名",
                    us: "Five people in charge",
                    cn: "5 名负责人。",
                    language,
                  })}
              </Text>
              <Text>
                {"・" +
                  getMessage({
                    ja: "20品番/結き治具",
                    us: "20 part number / Knotting jig",
                    cn: "20 个零件编号/连接夹具",
                    language,
                  })}
              </Text>
              <Text>
                {"・" +
                  getMessage({
                    ja: "結き治具/検査台は1種類",
                    us: "One type of tying jig/inspection table",
                    cn: "1 种接经夹具/检测台",
                    language,
                  })}
              </Text>
              <Text>
                {"・" +
                  getMessage({
                    ja: "作成/更新する必要があるファイル数:77点",
                    us: "Number of files that need to be created/updated: 77",
                    cn: "需要创建/更新的文件数量: 77",
                    language,
                  })}
              </Text>
              <Text>
                {"・" +
                  getMessage({
                    ja: "1月出図-7月量確(マル即による変更5回)",
                    us: "January chart - July volume confirmation (5 changes due to Maru-July)",
                    cn: "1 月至 7 月（因 MaruSoku 而有 5 次变动）。",
                    language,
                  })}
              </Text>
              <Text>
                {"・" +
                  getMessage({
                    ja: "77×5=385ファイルの変更が必要",
                    us: "77 x 5 = 385 files need to be changed",
                    cn: "77 x 5 = 385 个文件需要更改",
                    language,
                  })}
              </Text>
            </Box>
          </VStack>
        </SectionBox>
        <Box ml="4">
          <SectionBox
            id="section2_1"
            title={
              "2-1." +
              getMessage({
                ja: "成果物作成の流れを比較",
                us: "Deliverable comparison",
                cn: "创建交付品过程的比较",
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
                ja: "下図のように回路マトリクスを手動で作成、それを基に各成果物を作成していました。",
                us: "As shown in the figure below, a circuit matrix was manually created, and each deliverable was created based on this matrix.",
                cn: "如下图所示，电路矩阵是人工创建的，每个交付品都是在此基础上创建的。",
                language,
              })}
            </Text>
            <VStack justifyContent="center" mt={4} spacing={0}>
              <Box
                bg="gray.300"
                color="black"
                w="90%"
                p={1}
                mt={4}
                borderTopRadius={5}
                border="1px solid"
              >
                {getMessage({
                  ja: "生産準備+の導入前",
                  us: "Before introduction of Production Preparation+.",
                  cn: "在引入生产准备+之前。",
                  language,
                })}
              </Box>
              <Image src="/images/0009/0001.svg" w="90%" />
              <Text w="90%">
                {getMessage({
                  ja: "立ち上げ時に作成したファイルをそれぞれ修正していました",
                  us: "Each file created at startup was modified.",
                  cn: "启动时创建的每个文件都被修改。",
                  language,
                })}
              </Text>
            </VStack>
            <HStack justifyContent="center" mt={4}>
              <Icon as={PiArrowFatLineDownLight} fontSize="40px" />
            </HStack>
            <VStack justifyContent="center" spacing={0}>
              <Box
                bg="gray.300"
                color="black"
                w="90%"
                p={1}
                mt={6}
                borderTopRadius={5}
                border="1px solid"
              >
                {getMessage({
                  ja: "生産準備+の導入後",
                  us: "After the introduction of Production Preparation+.",
                  cn: "在引入 生产准备+ 之后。",
                  language,
                })}
              </Box>
              <Image src="/images/0009/0002.svg" w="90%" />
              <Text w="90%">
                {getMessage({
                  ja: "導入後は生産準備+のファイル一つから各成果物を作成。これにより一つのファイル修正で変更が反映できます。",
                  us: "After implementation, each deliverable is created from a single file in Production Preparation+. This allows changes to be reflected in a single file modification.",
                  cn: "实施后，每个交付品都是通过 Production Preparation+ 中的单个文件创建的。这样，只需修改一次文件，就能反映出变化。",
                  language,
                })}
                <br />
                {getMessage({
                  ja: "※竿レイアウト図はクランプ番号の手入力が必要です。",
                  us: "*Pole layout drawings require manual input of clamp numbers.",
                  cn: "*杆布局图需要手动输入夹钳编号。",
                  language,
                })}
              </Text>
            </VStack>
          </SectionBox>
          <SectionBox
            id="section2_2"
            title={
              "2-2." +
              getMessage({
                ja: "工数の推移を比較",
                us: "Person-hour comparison",
                cn: "工时比较",
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
                ja: "以上を踏まえて立上げ工数の推移を確認していきます。",
                us: "Based on the above, we will check the start-up man-hours.",
                cn: "根据上述情况，将对启动工时进行检查。",
                language,
              })}
            </Text>
            <Text my={6}>
              {getMessage({
                ja: "マル即などによる変更を反映していく必要があります。それを踏まえて実際の製品切替を数字を使って見てみましょう。",
                us: "It is necessary to reflect changes due to mal immediate and other factors. With that in mind, let's look at the actual product changeover using numbers.",
                cn: "有必要反映出由于不当立即和其他因素造成的变化。有鉴于此，让我们用数字来看看实际的产品转换情况。",
                language,
              })}
            </Text>
            <Box
              bg="gray.300"
              color="black"
              w="100%"
              p={1}
              mt={4}
              borderTopRadius={5}
              borderTop="1px solid"
              borderRight="1px solid"
              borderLeft="1px solid"
            >
              {getMessage({
                ja: "生産準備+の導入前",
                us: "Before introduction of Production Preparation+.",
                cn: "在引入生产准备+之前。",
                language,
              })}
            </Box>
            <Box border="1px solid">
              <SjpChart01 language={language} />
            </Box>
            <Text>
              {getMessage({
                ja: "特定の期間に業務が集中した結果、残業と休出が発生しています。",
                us: "Overtime and time off have been incurred as a result of the concentration of work during certain periods of the year.",
                cn: "由于工作集中在某些时间段，造成了加班和请假。",
                language,
              })}
            </Text>
            <HStack justifyContent="center" mt={4}>
              <Icon as={PiArrowFatLineDownLight} fontSize="40px" />
            </HStack>
            <Box
              bg="gray.300"
              color="black"
              w="100%"
              p={1}
              mt={4}
              borderTopRadius={5}
              borderTop="1px solid"
              borderRight="1px solid"
              borderLeft="1px solid"
            >
              {getMessage({
                ja: "生産準備+の導入後",
                us: "After the introduction of Production Preparation+.",
                cn: "在引入 生产准备+ 之后",
                language,
              })}
            </Box>
            <Box border="1px solid">
              <SjpChart02 language={language} />
            </Box>
            <Text>
              {getMessage({
                ja: "一つのファイルを編集して成果物は自動作成する事で大幅に工数が下がっています。",
                us: "By editing a single file and automatically creating the deliverables, man-hours are significantly reduced.",
                cn: "通过编辑单一文件并自动创建交付成果，可大大减少工时。",
                language,
              })}
            </Text>
          </SectionBox>
          <SectionBox
            id="section2_3"
            title={
              "2-3." +
              getMessage({
                ja: "効果の比較まとめ",
                us: "Effectiveness Comparison",
                cn: "成效比较摘要",
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
                ja: "実際に生産準備を行う人の意見をまとめました。",
                us: "The following is a summary of the opinions of those who actually prepare for production.",
                cn: "下表概括了实际准备生产者的意见。",
                language,
              })}
            </Text>
            <Box
              bg="gray.300"
              color="black"
              w="100%"
              p={1}
              mt={4}
              borderTopRadius={5}
              borderTop="1px solid"
              borderRight="1px solid"
              borderLeft="1px solid"
            >
              {getMessage({
                ja: "生産準備+の導入前",
                us: "Before introduction of Production Preparation+.",
                cn: "在引入生产准备+之前。",
                language,
              })}
            </Box>
            <Box
              borderBottom="1px solid"
              borderLeft="1px solid"
              borderRight="1px solid"
              p={3}
            >
              <Text>
                {getMessage({
                  ja: "工数",
                  us: "Person-hours",
                  cn: "工数",
                  language,
                })}
              </Text>
              <Text>
                <Icon as={FaStarHalfAlt} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                {getMessage({
                  ja: "切り替え時に工数が集中して掛かる(業務工数の偏りによる残業)",
                  us: "Concentration of man-hours at the time of changeover (overtime due to uneven workload)",
                  cn: "转换期间工时集中（工作量不均导致加班）。",
                  language,
                })}
                <br />
                <Icon as={FaStarHalfAlt} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                {getMessage({
                  ja: "修正ファイルの数が多く修正が困難(ミス/不良発生の原因)",
                  us: "Difficult to correct due to large number of corrected files (causes mistakes/defects)",
                  cn: "由于修正文件较多（导致错误/缺陷），难以修正。",
                  language,
                })}
                <br />
              </Text>
              <Text mt={4}>
                {getMessage({
                  ja: "品質面",
                  us: "Quality",
                  cn: "质量方面",
                  language,
                })}
              </Text>
              <Text>
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                {getMessage({
                  ja: "手入力のミスによる切替時の不良発生の増加",
                  us: "Increased occurrence of defects during changeover due to manual input errors",
                  cn: "由于人工输入错误，在转换过程中出现的缺陷增加",
                  language,
                })}
              </Text>
              <Text mt={4}>
                {getMessage({
                  ja: "生活",
                  us: "Lifestyles",
                  cn: "生活",
                  language,
                })}
              </Text>
              <Text>
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                <Icon as={FaRegStar} color="gray.600" mr={1} />
                {getMessage({
                  ja: "切り替え時に生活が不安定になる(離職の原因)",
                  us: "Life becomes unstable during the switchover (cause of turnover)",
                  cn: "生计在转换时变得不稳定（脱离的原因）。",
                  language,
                })}
              </Text>
            </Box>
            <HStack justifyContent="center" mt={4}>
              <Icon as={PiArrowFatLineDownLight} fontSize="40px" />
            </HStack>
            <Box
              bg="gray.300"
              color="black"
              w="100%"
              p={1}
              mt={4}
              borderTopRadius={5}
              borderTop="1px solid"
              borderRight="1px solid"
              borderLeft="1px solid"
            >
              {getMessage({
                ja: "生産準備+の導入後",
                us: "After the introduction of Production Preparation+.",
                cn: "在引入 生产准备+ 之后。",
                language,
              })}
            </Box>
            <Box
              borderBottom="1px solid"
              borderLeft="1px solid"
              borderRight="1px solid"
              p={3}
            >
              <Text>
                {getMessage({
                  ja: "工数",
                  us: "Person-hours",
                  cn: "工数",
                  language,
                })}
              </Text>
              <Text>
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStar} color="gray.600" mr={1} />
                {getMessage({
                  ja: "自動化により作成工数が極端に減少",
                  us: "Automation drastically reduces man-hours required for creation",
                  cn: "自动化大大减少了创建所需的工时。",
                  language,
                })}
                <br />
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStar} color="gray.600" mr={1} />
                {getMessage({
                  ja: "修正ファイルは１個、反映が簡単",
                  us: "One modified file, easy to reflect",
                  cn: "一个修正文件，易于反映。",
                  language,
                })}
                <br />
              </Text>
              <Text mt={4}>
                {getMessage({
                  ja: "品質面",
                  us: "Quality",
                  cn: "质量方面",
                  language,
                })}
              </Text>
              <Text>
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStarHalfAlt} color="gray.600" mr={1} />
                {getMessage({
                  ja: "自動処理の箇所は入力ミスが発生しません",
                  us: "Automatic processing sections will not cause input errors.",
                  cn: "自动处理部分无输入错误",
                  language,
                })}
              </Text>
              <Text mt={4}>
                {getMessage({
                  ja: "生活",
                  us: "Lifestyles",
                  cn: "生活",
                  language,
                })}
              </Text>
              <Text>
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStar} color="gray.600" mr={1} />
                <Icon as={FaStar} color="gray.600" mr={1} />
                {getMessage({
                  ja: "安定した時間に帰宅できる",
                  us: "Able to return home at a stable time",
                  cn: "能够在稳定的时间回家",
                  language,
                })}
              </Text>
            </Box>
          </SectionBox>
        </Box>

        <SectionBox
          id="section99"
          title={
            "99." +
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
                ja: "上記の効果には以下を含んでいません。",
                us: "The above effects do not include.",
                cn: "上述影响不包括。",
                language,
              })}
              <br />
              <br />
              {"・" +
                getMessage({
                  ja: "検査履歴システム用ポイント点滅",
                  us: "Point flashing for inspection history system",
                  cn: "检查记录系统的点闪",
                  language,
                })}
              <br />
              {"・" +
                getMessage({
                  ja: "配策誘導ナビ(補給品で特に有効)",
                  us: "Guided navigation for distribution (especially useful for supplies)",
                  cn: "配送指导导航（对供应品特别有用）。",
                  language,
                })}
              <br />
              {"・" +
                getMessage({
                  ja: "先ハメ誘導",
                  us: "Prerecorded induction",
                  cn: "预录诱导",
                  language,
                })}
              <br />
              {"・" +
                getMessage({
                  ja: "サブ自動立案",
                  us: "Subautomatic drafting",
                  cn: "次自动起草",
                  language,
                })}
              <br />
              <br />
              {getMessage({
                ja: "データがまとまり次第追記します。",
                us: "We will add the data as soon as it is compiled.",
                cn: "数据整理完成后将立即添加。",
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
        <Box h="31vh" />
      </Frame>
    </>
  );
};

export default BlogPage;
