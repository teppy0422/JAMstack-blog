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
} from "@chakra-ui/react";
import { CiHeart } from "react-icons/ci";
import { LuPanelRightOpen } from "react-icons/lu";
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
import UnderlinedTextWithDrawer from "./UnderlinedTextWithDrawer";
import ExternalLink from "./ExternalLink";
import IframeDisplay from "./IframeDisplay";

import "@fontsource/noto-sans-jp";

const customTheme = extendTheme({
  fonts: {
    heading: "'Noto Sans JP', sans-serif",
    body: "'Noto Sans JP', sans-serif",
  },
  fontWeights: {
    normal: 200,
    medium: 300,
    bold: 400,
    light: 300,
    extraLight: 100,
  },
});
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
const BlogPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const sections = useRef<{ id: string; title: string }[]>([]);
  const { colorMode } = useColorMode();
  const [showConfetti, setShowConfetti] = useState(false); // useStateをコンポーネント内に移動
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // onOpenを追加
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const showToast = useCustomToast();
  //64pxまでスクロールしないとサイドバーが表示されないから暫定
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const yOffset = -64; // 64pxのオフセット
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100); // 100msの遅延を追加
    } else {
      window.scrollTo(0, 150);
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  }, []);
  //#の位置にスクロールした時のアクティブなセクションを装飾
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-64px 0px -99% 0px", threshold: 0 }
    );
    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);
  //#クリックした時のオフセット
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          const yOffset = -64; // 64pxのオフセット
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    };
    window.addEventListener("hashchange", handleHashChange, false);
    return () => {
      window.removeEventListener("hashchange", handleHashChange, false);
    };
  }, []);
  const handleOpen = (drawerName: string) => {
    setActiveDrawer(drawerName);
    onOpen();
  };
  const handleClose = () => {
    setActiveDrawer(null);
    onClose();
  };

  return (
    <>
      <Frame sections={sections} sectionRefs={sectionRefs}>
        <Box p={5}>
          <Heading as="h1" size="md" mb={4}>
            リモートシステム更新/管理サービス契約書
          </Heading>
          <Divider mb={4} />
          <VStack align="start" spacing={4}>
            <Text fontSize="lg" fontWeight="bold">
              第1条（目的）
            </Text>
            <Text>
              本契約は、甲（片岡哲兵）が乙（顧客）に対して、システム更新および管理サービス（以下「サービス」）を提供することを目的とします。
              ※システムとは「生産準備+」「順立生産システム」などの甲が作成したシステムを指します。
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              第2条（最終目的）
            </Text>
            <Text>
              甲が関わらなくても維持/更新できるようにする事を最終目的とします。
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              第3条（契約期間）
            </Text>
            <Text>
              本契約の有効期間は、契約締結日から1年間とし、期間満了の30日前までにいずれかの当事者から書面による解約の通知がない限り、自動的に1年間更新されるものとします。
              契約の更新日は毎年【4月21日】です。
            </Text>

            <Text fontSize="lg" fontWeight="bold">
              第4条（サービス内容）
            </Text>
            <Text>
              甲は、以下のサービスを乙に提供します。
              <br />
              1. システムへの機能追加と最適化
              <span style={{ color: "red" }}>※別紙1</span>
              <br />
              2. システム不具合の特定と修正(1週間以内の対応)
              <br />
              3. システムの永続的な維持継続に努めます。
              <br />
              ・OS(Windows)のバージョンに依存する問題の修正
              <br />
              ・MicroSoft Officeのバージョン変更に依存する問題の修正。
              <br />
              ・ブラウザ(EdgeやChrome)に依存する問題の修正。
              <br />
              ※上記は継続使用する場合に必ず問題になる項目です。
              対応都度にその対応手順を説明ページに追加します。これにより甲以外でも対応できる事を目指します。
              <br />
              4. リモートで円滑に連絡をとるWEBサービスの提供
              <br />
              ・専用WEBアプリによるリアルタイムチャット（甲による開発）
              <span style={{ color: "red" }}>※別紙2</span>
              <br />
              ・最新版のダウンロードサイト（甲による開発）
              <span style={{ color: "red" }}>※別紙3</span>
              <br />
              ・WEBサイトに説明ページの作成/追加（2ページ/月程度）
              <span style={{ color: "red" }}>※別紙4</span>
              <br />
              ※上記により発生する費用は甲の負担とします。
              <br /> 5. 定期レポートによる報告
              <br />
              ・毎月末にメールにて1ヶ月の活動実績のまとめを報告します
              <br />
              <br />
              以下の場合は別途の見積もり対応（または相談）となります
              <br />
              ・1案件で対応工数が合計24.0Hを超えるシステム修正/新規作成の場合
              <br />
              ・他社が作成したシステム修正
              <br />
            </Text>

            <Text fontSize="lg" fontWeight="bold">
              第5条（お支払い条件）
            </Text>
            <Text>
              乙は、甲に対して、月額100,000円（税別）を支払うものとします。支払いは毎月末日までに甲の指定する口座に行うものとします。
            </Text>

            <Text fontSize="lg" fontWeight="bold">
              第6条（契約解除）
            </Text>
            <Text>
              いずれかの当事者が本契約の条項に違反した場合、相手方は書面による通知をもって本契約を解除することができるものとします。
              <br />
              いずれの当事者も30日前のメールによる通知によって本契約を解除する事ができるものとします。
              <br />
              特に、乙がシステムの更新/維持を甲に依頼する必要が無くなったと判断した場合は契約の解除をお勧めします。
            </Text>

            <Text fontSize="lg" fontWeight="bold">
              第7条（秘密保持）
            </Text>
            <Text>
              甲および乙は、本契約に関連して知り得た相手方の秘密情報を第三者に開示してはならないものとします。
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              第8条（不可抗力）
            </Text>
            <Text>
              自然災害やその他予見不可能な事態が契約の尾行を妨げる場合、該当する当事者はその責から免れます。
            </Text>

            <Text fontSize="lg" fontWeight="bold">
              第9条（その他の条件）
            </Text>
            <Text>
              本契約に定めのない事項については、両当事者が誠意をもって協議し、解決するものとします。
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              第10条（その他の条件）
            </Text>
            <Text>
              本契約のいかなる条項も、双方の書面による合意なしに変更することはできません。
              <br />
              本契約に定めのない事項については、両当事者が誠意をもって協議し、解決するものとします。
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              署名
            </Text>
            <Text>
              本契約の内容を確認し、以下に署名することにより、両当事者は本契約の条件に同意します。
            </Text>
            <Box mt={4}>
              <Text>契約開始日:</Text>
              <Text>日付: 2024年12月21日</Text>
            </Box>
            <Box mt={4}>
              <Text>甲の署名:</Text>
              <Text my={4}>署名: ___________________________</Text>
              <Text my={4}>日付: ___________________________</Text>
            </Box>
            <Box mt={4}>
              <Text>乙の署名:</Text>
              <Text my={4}>署名: ___________________________</Text>
              <Text my={4}>日付: ___________________________</Text>
            </Box>
          </VStack>
        </Box>
        <Box h="0.01vh" />
      </Frame>
    </>
  );
};

export default BlogPage;
