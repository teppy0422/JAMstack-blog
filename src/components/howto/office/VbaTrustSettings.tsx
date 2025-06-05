"use client";

import React from "react";
import {
  useDisclosure,
  Box,
  Icon,
  Text,
  Image,
  List,
  ListItem,
} from "@chakra-ui/react";
import { FaShieldAlt } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import HowToModal from "../HowToModal";
import { ImageWithHighlight } from "app/skillBlogs/components/ImageWidthHighlight";

const VBATrustSettingsModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { language } = useLanguage();

  const title = getMessage({
    ja: "「信頼性に欠ける」エラーへの対応手順",
    us: 'Procedures for dealing with "unreliable" errors',
    cn: "处理 '不可靠' 错误的程序。",
  });

  const body = (
    <>
      <Text mb={4}>
        {getMessage({
          ja: `Excelでプログラムを実行するにはこの設定が必要です。この設定は初回のみ1度だけです。`,
          us: `This setting is required to run the program in Excel. This setting is only required once, the first time.`,
          cn: `在 Excel 中运行程序时需要此设置。此设置只需要一次，即第一次。`,
        })}
      </Text>
      <ImageWithHighlight
        src="/images/howTo/vba-trust-error.webp"
        label={
          "*" +
          getMessage({
            ja: "[設定してない場合のエラー画面]",
            us: "[Error screen if not set]",
            cn: "[未设置时的错误屏幕]。",
          })
        }
      />
      <List spacing={3} pl={4} styleType="decimal">
        <ListItem>
          {getMessage({
            ja: `Excelファイルを開いて[ファイル]→[オプション]→1[セキュリティセンター]→2[セキュリティセンターの設定]`,
            us: `Open an Excel file [File] -> [Options] -> 1 [Security Center] -> 2 [Security Center Settings].`,
            cn: `打开 Excel 文件 [文件] → [选项] → 1 [安全中心] → 2 [安全中心设置]。`,
          })}
        </ListItem>
        <ImageWithHighlight
          src="/images/howTo/vba-trust-setting.png"
          label="※[EXCELのオプション]"
          highlights={[
            {
              top: "40.5%",
              left: "0%",
              w: "16%",
              h: "6.5%",
              animation: "blink",
              borderRadius: "3px",
              bg: "repeating-linear-gradient(45deg, rgba(255,0,0,0.1), rgba(255,0,0,0.1) 4px, transparent 4px, transparent 6px)",
              label: "1",
              labelTop: "50%",
              labelLeft: "-13%",
            },
            {
              top: "44%",
              left: "80%",
              w: "19%",
              h: "6%",

              animation: "blink",
              borderRadius: "3px",
              bg: "repeating-linear-gradient(45deg, rgba(255,0,0,0.1), rgba(255,0,0,0.1) 4px, transparent 4px, transparent 6px)",
              label: "2",
              labelTop: "50%",
              labelLeft: "-11%",
            },
          ]}
        />
        <ListItem>
          {getMessage({
            ja: `3[マクロの設定]→4[VBAプロジェクトオブジェクトモデルへのアクセスを信頼する]を☑️→5[OK]をクリック`,
            us: `Check "Unblock" in the "Security" section and click "OK"`,
            cn: `在“安全性”部分勾选“解除锁定”并点击“确定”`,
          })}
        </ListItem>
        <ImageWithHighlight
          src="/images/howTo/vba-trust-setting-securityCenter.png"
          label="※[セキュリティセンター]"
          highlights={[
            {
              top: "28%",
              left: "0%",
              w: "16%",
              h: "6.5%",
              animation: "blink",
              borderRadius: "3px",
              bg: "repeating-linear-gradient(45deg, rgba(255,0,0,0.1), rgba(255,0,0,0.1) 4px, transparent 4px, transparent 6px)",
              label: "3",
              labelTop: "50%",
              labelLeft: "-13%",
            },
            {
              top: "29%",
              left: "17%",
              w: "36%",
              h: "6%",

              animation: "blink",
              borderRadius: "3px",
              bg: "repeating-linear-gradient(45deg, rgba(255,0,0,0.1), rgba(255,0,0,0.1) 4px, transparent 4px, transparent 6px)",
              label: "4 チェックオン",
              labelTop: "165%",
              labelLeft: "30%",
            },
            {
              top: "93.5%",
              left: "80%",
              w: "10%",
              h: "6.5%",

              animation: "blink",
              borderRadius: "3px",
              bg: "repeating-linear-gradient(45deg, rgba(255,0,0,0.1), rgba(255,0,0,0.1) 4px, transparent 4px, transparent 6px)",
              label: "5",
              labelTop: "50%",
              labelLeft: "-20%",
            },
          ]}
        />
        <ListItem>
          {getMessage({
            ja: `Excelを一度終了すると設定完了。次の起動時に反映されます`,
            us: `Reopen Excel and check if macros are enabled`,
            cn: `重新打开 Excel 并检查宏是否可用`,
          })}
        </ListItem>
      </List>

      <Text fontSize="sm" color="gray.600" mt={3}>
        {"※ " +
          getMessage({
            ja: "この設定は信頼できるフォルダ・ファイルにのみ使用してください。",
            us: "Use this setting only for trusted folders/files.",
            cn: "请仅对可信文件或文件夹使用此设置。",
          })}
      </Text>
    </>
  );

  return (
    <>
      <Box
        as="span"
        onClick={onOpen}
        display="inline-flex"
        alignItems="center"
        cursor="pointer"
        textDecoration="none"
        borderBottom="2px solid"
        color="blue.400"
        borderColor="blue.400"
      >
        {getMessage({
          ja: "マクロを信頼する設定",
          us: "How to Fix Macro Disabled Error",
          cn: "如何修复宏被禁用错误",
        })}
        <Icon as={FaShieldAlt} mx={1} />
      </Box>

      <HowToModal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        body={body}
        size="lg"
      />
    </>
  );
};

export default VBATrustSettingsModal;
