"use client";

import React from "react";
import { Box, Heading, Text, Image } from "@chakra-ui/react";
import "./style.css";

import IpadFrame from "@/components/ipad";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

const ScrollableContent: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <IpadFrame>
      <Box maxWidth="100vw" overflowX="hidden" height="90vh" className="body_">
        <Heading as="h2" size="lg" mt={4} textAlign="center">
          {"70." +
            getMessage({
              ja: "ポイント点滅",
              language,
            })}
        </Heading>
        <Text as="h4" mt={2} textAlign="center">
          {getMessage({
            ja: "下記はYC-Cで検査する場合の例です",
            us: "Below is an example of inspection by YC-C",
            cn: "以下是使用 YC-C 进行检查的示例",
            language,
          })}
          <br />
          {getMessage({
            ja: "意見を頂ければ自由に対応可能です",
            us: "Feel free to respond with your input.",
            cn: "如果您提出意见，我们可以随时答复。",
            language,
          })}
        </Text>
        <Text mt={4} textAlign="center">
          {getMessage({
            ja: "スクロールしてください",
            us: "Please scroll down.",
            cn: "滚动到",
            language,
          })}
        </Text>
        <Box className="container" mt="15vh" textAlign="center">
          <svg
            className="animated-svg"
            width="40"
            height="40"
            viewBox="0 0 15 15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3.85355 2.14645C3.65829 1.95118 3.34171 1.95118 3.14645 2.14645C2.95118 2.34171 2.95118 2.65829 3.14645 2.85355L7.14645 6.85355C7.34171 7.04882 7.65829 7.04882 7.85355 6.85355L11.8536 2.85355C12.0488 2.65829 12.0488 2.34171 11.8536 2.14645C11.6583 1.95118 11.3417 1.95118 11.1464 2.14645L7.5 5.79289L3.85355 2.14645ZM3.85355 8.14645C3.65829 7.95118 3.34171 7.95118 3.14645 8.14645C2.95118 8.34171 2.95118 8.65829 3.14645 8.85355L7.14645 12.8536C7.34171 13.0488 7.65829 13.0488 7.85355 12.8536L11.8536 8.85355C12.0488 8.65829 12.0488 8.34171 11.8536 8.14645C11.6583 7.95118 11.3417 7.95118 11.1464 8.14645L7.5 11.7929L3.85355 8.14645Z"
              fill="#FFF"
            />
          </svg>
        </Box>
        <Box as="ul" className="box">
          <Box as="li" className="scroll_left" maxW={600}>
            <iframe
              src="/html/Sjp/70/8211158A40/0013.html"
              allowFullScreen
            ></iframe>
            <Text as="h4">
              {getMessage({
                ja: "任意のポイントを点滅させる画像を作成できます",
                us: "You can create an image that blinks any point.",
                cn: "您可以创建一个闪烁任意点的图像。",
                language,
              })}
            </Text>
          </Box>
          <Box as="li" className="scroll_right" maxW={600}>
            <iframe
              src="/html/Sjp/70/8211158A40/0080.html"
              allowFullScreen
            ></iframe>
            <Text as="h4">
              {getMessage({
                ja: "電線が無い経路の場合はこのようになります",
                us: "For a route with no wires, it would look like this.",
                cn: "没有电线的线路就是这种情况",
                language,
              })}
              <br />
              {getMessage({
                ja: "これは空栓(詰栓)の場合です",
                us: "This is the case of an empty (plugged) plug.",
                cn: "这适用于空（堵塞）插头",
                language,
              })}
            </Text>
          </Box>
          <Box as="li" className="scroll_left" maxW={600}>
            <iframe
              src="/html/Sjp/70/8211158A40/0022.html"
              height="400"
              allowFullScreen
            ></iframe>
            <Text as="h4">
              {getMessage({
                ja: "コネクタの二重係止と共用ポイントの場合",
                us: "For double-engaging connectors and shared points.",
                cn: "用于双啮合连接器和共享点",
                language,
              })}
              <br />
              {getMessage({
                ja: "二重係止の確認を促す為にメッセージが表示されます",
                us: "A message will be displayed to prompt you to confirm the double-engagement.",
                cn: "系统会显示一条信息，提示您确认双重啮合。",
                language,
              })}
            </Text>
          </Box>
          <Box as="li" className="scroll_right" maxW={600}>
            <iframe
              src="/html/Sjp/70/8211158A40/0888.html"
              height="400"
              allowFullScreen
            ></iframe>
            <Text as="h4">
              {getMessage({
                ja: "リレーボックスなどの大型コネクタも表示可能",
                us: "Large connectors such as relay boxes can also be displayed.",
                cn: "还可以显示继电器盒等大型连接器。",
                language,
              })}
            </Text>
          </Box>
          <Box as="li" className="scroll_left" maxW={600}>
            <Image src="/html/Sjp/70/pointList.png" border="0" />
            <Text as="h4">
              {getMessage({
                ja: "ポイントナンバーの入力画面",
                us: "Point number input screen.",
                cn: "输入点编号屏幕。",
                language,
              })}
              <br />
              {getMessage({
                ja: "黄色の欄に入力するだけです",
                us: "Just type in the yellow field.",
                cn: "只需在黄色字段中输入即可。",
                language,
              })}
            </Text>
          </Box>
          <Box as="li" className="scroll_right">
            <Image src="/html/Sjp/70/menu70.png" maxW={600} />
            <Text as="h4">
              {getMessage({
                ja: "ポイントナンバーを入力した後はMENUから作成実行",
                us: "After entering the point number, go to MENU and execute creation.",
                cn: "输入点编号后，使用菜单执行创建。",
                language,
              })}
            </Text>
          </Box>
          <Box as="li" className="scroll_left">
            <Image src="/html/Sjp/70/code.png" maxW={600} />
            <Text as="h4">
              {getMessage({
                ja: "生産準備+から上記コードを作成",
                us: "Create the above code from Production Preparation+.",
                cn: "从生产准备+中创建上述代码。",
                language,
              })}
              <br />
              {getMessage({
                ja: "WEBサーバーが無くても動作します",
                us: "Works without a web server.",
                cn: "无需网络服务器即可运行。",
                language,
              })}
              <br />
              {getMessage({
                ja: "なのでVB.netやJAVAで作成したローカルアプリでも簡単に使用できます",
                us: "So even local applications created with VB.net or JAVA can be used easily!",
                cn: "因此，即使是用 VB.net 或 JAVA 创建的本地应用程序也能轻松使用。",
                language,
              })}
            </Text>
            <Text as="h5">
              {getMessage({
                ja: "※ブラウザはIE11以上が必要",
                us: "*Browser must be IE11 or higher.",
                cn: "*浏览器要求 IE11 或更高版本。",
                language,
              })}
            </Text>
          </Box>
          <Box as="li" className="scroll_up" maxW={600}>
            <video
              src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241018152413.mp4"
              loop
              autoPlay
              muted
            ></video>
            <Text as="h4">
              {getMessage({
                ja: "検査履歴システム(瀬戸内部品開発)での使用動画",
                us: "Video of use in Inspection history system (Setouchi parts development)",
                cn: "检查履历系统的使用视频（濑户内部件开发）。",
                language,
              })}
            </Text>
          </Box>
        </Box>
        <Box
          height="90vh"
          backgroundImage="url('https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241021054156.jpg')"
          backgroundSize="cover"
          backgroundPosition="center"
          color="#fff"
        >
          <Box height="10px"></Box>
          <Box textAlign="left" ml="5%">
            <Heading
              as="h1"
              mb="10px"
              color="#fff"
              textShadow="none"
              fontWeight="bold"
            >
              {getMessage({
                ja: "まとめ",
                language,
              })}
            </Heading>
            <Text
              as="h3"
              color="#fff"
              textShadow="none"
              fontWeight="bold"
              textAlign="left"
            >
              {getMessage({
                ja: "検査履歴システム用にポイントが点滅するように作った例です",
                us: "This is an example of making points blink for an inspection history system.",
                cn: "检查履历系统的闪光点示例。",
                language,
              })}
              <br />
              <br />
              {getMessage({
                ja: "他にも使用するアイデアがあればご意見ください",
                us: "If you have other ideas for use, please let us know.",
                cn: "如果您有其他使用想法，请向我们提出建议。",
                language,
              })}
            </Text>
          </Box>
        </Box>
      </Box>
    </IpadFrame>
  );
};

export default ScrollableContent;
