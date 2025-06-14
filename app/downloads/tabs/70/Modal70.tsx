"use client";

import React from "react";
import { Box, Text, Image, useDisclosure, Flex } from "@chakra-ui/react";

import CustomModal from "@/components/ui/CustomModal";
import CustomModalTab from "../../parts/CustomModalTab";
import IpadFrame from "@/components/ipad";
import AnimatedListItem from "../40/AnimatedListItem";
import ImageWithHighlight from "@/components/ImageWidthHighlight";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

const ScrollableContent: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const CircleBadge = ({ label }: { label: string }) => (
    <Box
      bg="red.500"
      py="0px"
      px="6px"
      fontSize="12px"
      height="16px"
      minW="16px"
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      display="inline-flex"
      mr="2px"
    >
      {label}
    </Box>
  );
  return (
    <>
      <CustomModalTab
        path="/"
        text={
          "70." +
          getMessage({
            ja: "ポイント点滅",
            language,
          })
        }
        media="html"
        onOpen={onOpen}
      />
      <CustomModal
        title={
          "70." +
          getMessage({
            ja: "ポイント点滅",
            language,
          })
        }
        isOpen={isOpen}
        onClose={onClose}
        modalSize="xl"
        macCloseButtonHandlers={[onClose]}
        footer={
          <>
            <Text>
              {getMessage({
                ja: "YC-Cで検査する場合の例です。",
                us: "an example of inspection by YC-C.",
                cn: "是使用 YC-C 进行检查的示例。",
                language,
              })}
              {getMessage({
                ja: "意見を頂ければ自由に対応可能です。",
                us: "Feel free to respond with your input.",
                cn: "如果您提出意见，我们可以随时答复。",
                language,
              })}
            </Text>
          </>
        }
      >
        <Box
          style={{
            width: "100%",
            height: "80vh",
            overflowX: "hidden",
          }}
          id="modal-scroll-body"
          sx={{
            backgroundImage: `
              repeating-conic-gradient(
                #1c1b19 0% 25%, 
                #0e0f0c 0% 50%
              )
            `,
            backgroundSize: "32px 32px",
            backgroundAttachment: "fixed",
            color: "#eee",
          }}
        >
          <Box
            mt="2vh"
            textAlign="center"
            sx={{
              animation: "blink 1s ease-in-out infinite",
            }}
          >
            {getMessage({
              ja: "スクロールしてください",
              us: "Please scroll down.",
              cn: "滚动到",
              language,
            })}
          </Box>
          <Flex mt="1vh" justifyContent="center" align-items="center" h="40px">
            <style>
              {`
                @keyframes moveUpDown {
                  0% {
                    transform: translateX(-50%) translateY(0);
                  }
                  50% {
                    transform: translateX(-50%) translateY(-10px);
                  }
                  100% {
                    transform: translateX(-50%) translateY(0);
                  }
                }
                @keyframes blink {
                  0% { opacity: 1; }
                  50% { opacity: 0.5; }
                  100% { opacity: 1; }
                }
              `}
            </style>
            <AnimatedListItem direction="top">
              <svg
                style={{
                  position: "absolute",
                  top: "10vh",
                  left: "50%",
                  transform: "translateX(-50%)",
                  animation: "moveUpDown 2s ease-in-out infinite",
                }}
                width="40"
                height="40"
                viewBox="0 0 15 15"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.85355 2.14645C3.65829 1.95118 3.34171 1.95118 3.14645 2.14645C2.95118 2.34171 2.95118 2.65829 3.14645 2.85355L7.14645 6.85355C7.34171 7.04882 7.65829 7.04882 7.85355 6.85355L11.8536 2.85355C12.0488 2.65829 12.0488 2.34171 11.8536 2.14645C11.6583 1.95118 11.3417 1.95118 11.1464 2.14645L7.5 5.79289L3.85355 2.14645ZM3.85355 8.14645C3.65829 7.95118 3.34171 7.95118 3.14645 8.14645C2.95118 8.34171 2.95118 8.65829 3.14645 8.85355L7.14645 12.8536C7.34171 13.0488 7.65829 13.0488 7.85355 12.8536L11.8536 8.85355C12.0488 8.65829 12.0488 8.34171 11.8536 8.14645C11.6583 7.95118 11.3417 7.95118 11.1464 8.14645L7.5 11.7929L3.85355 8.14645Z"
                  fill="#ccc"
                />
              </svg>
            </AnimatedListItem>
          </Flex>
          <Flex
            mt="20px"
            py="10px"
            px="20px"
            w="100%"
            direction="column"
            gap="30px"
          >
            <Flex justifyContent="flex-start">
              <Box maxW="40%">
                <AnimatedListItem direction="left">
                  <Box backgroundColor="#f0f0f0" borderRadius="4px" p={1}>
                    <iframe
                      src="/html/Sjp/70/8211158A40/0013.html"
                      allowFullScreen
                    />
                  </Box>
                  <Text fontSize="13px" py="4px">
                    <CircleBadge label="1" />
                    {getMessage({
                      ja: "任意のポイントを点滅させる画像を作成できます",
                      us: "You can create an image that blinks any point.",
                      cn: "您可以创建一个闪烁任意点的图像。",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="flex-end">
              <Box maxW="55%">
                <AnimatedListItem direction="right">
                  <Box backgroundColor="#f0f0f0" borderRadius="4px" p={1}>
                    <iframe
                      src="/html/Sjp/70/8211158A40/0080.html"
                      style={{
                        display: "block",
                        width: "280px",
                      }}
                    />
                  </Box>
                  <Text fontSize="13px" py="4px">
                    <CircleBadge label="2" />
                    {getMessage({
                      ja: "詰栓はこのようになります",
                      us: "The plugs will look like this.",
                      cn: "插头将如下所示",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="flex-start">
              <Box maxW="40%">
                <AnimatedListItem direction="left">
                  <Box backgroundColor="#f0f0f0" borderRadius="4px" p={1}>
                    <iframe
                      src="/html/Sjp/70/8211158A40/0022.html"
                      style={{ height: "250px" }}
                      allowFullScreen
                    />
                  </Box>
                  <Text fontSize="13px" py="4px">
                    <CircleBadge label="3" />
                    {getMessage({
                      ja: "コネクタの二重係止と共用ポイントの場合、",
                      us: "For double-engaging connectors and shared points.",
                      cn: "用于双啮合连接器和共享点",
                      language,
                    })}
                    {getMessage({
                      ja: "二重係止の確認を促す為にメッセージが表示されます",
                      us: "A message will be displayed to prompt you to confirm the double-engagement.",
                      cn: "系统会显示一条信息，提示您确认双重啮合。",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="flex-end">
              <Box maxW="70%">
                <AnimatedListItem direction="right">
                  <Box backgroundColor="#f0f0f0" borderRadius="4px" p={1}>
                    <iframe
                      src="/html/Sjp/70/8211158A40/0888.html"
                      style={{
                        display: "block",
                        width: "300px",
                        height: "500px",
                      }}
                    />
                  </Box>
                  <Text fontSize="13px" py="4px">
                    <CircleBadge label="4" />
                    {getMessage({
                      ja: "リレーボックスなどの大型コネクタも表示可能",
                      us: "Large connectors such as relay boxes can also be displayed.",
                      cn: "还可以显示继电器盒等大型连接器。",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="flex-start">
              <Box maxW="75%">
                <AnimatedListItem direction="left">
                  <ImageWithHighlight
                    src="/html/Sjp/70/pointList.png"
                    mb={0}
                    label="※シート[CAV一覧]"
                    highlights={[
                      {
                        top: "12.3%",
                        left: "46.8%",
                        w: "12%",
                        h: "82%",
                        bg: "rgba(255,0,0,0.1)",
                        borderRadius: "5px",
                        animation: "blink",
                      },
                    ]}
                  />
                  <Text fontSize="13px" py="4px">
                    <CircleBadge label="5" />
                    {getMessage({
                      ja: "黄色の欄に入力して作成ボタンを押すと作成できます",
                      us: "Fill in the yellow fields and press the Create button to create it!",
                      cn: '在黄色字段中输入信息，然后按 "创建" 按钮进行创建。',
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="flex-end">
              <Box maxW="70%">
                <AnimatedListItem direction="right">
                  <ImageWithHighlight
                    src="/html/Sjp/70/menu70.png"
                    mb={0}
                    label="※作成MENU"
                    highlights={[]}
                  />
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="flex-start">
              <Box maxW="80%">
                <AnimatedListItem direction="left">
                  <ImageWithHighlight
                    src="/html/Sjp/70/code.png"
                    mb={0}
                    label="※VS-CODE"
                    highlights={[]}
                  />
                  <Text fontSize="13px" py="4px">
                    {getMessage({
                      ja: "生産準備+で[作成実行]を押すと上記コードが作成されます。",
                      us: "Create the above code from Production Preparation+.",
                      cn: "从生产准备+中创建上述代码。",
                      language,
                    })}
                    {getMessage({
                      ja: "このコードはWEBサーバーが無くても動作するように作っています。",
                      us: "Works without a web server.",
                      cn: "无需网络服务器即可运行。",
                      language,
                    })}
                    {getMessage({
                      ja: "なのでVB.netやJAVAで作成したローカルアプリでも簡単に使用できます",
                      us: "So even local applications created with VB.net or JAVA can be used easily!",
                      cn: "因此，即使是用 VB.net 或 JAVA 创建的本地应用程序也能轻松使用。",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="center">
              <Box maxW="90%">
                <AnimatedListItem direction="bottom">
                  <video
                    src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241018152413.mp4"
                    loop
                    autoPlay
                    muted
                  />
                  <Text fontSize="13px" py="4px">
                    {getMessage({
                      ja: "検査履歴システム(瀬戸内部品開発)での使用動画",
                      us: "Video of use in Inspection history system (Setouchi parts development)",
                      cn: "检查履历系统的使用视频（濑户内部件开发）。",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
          </Flex>
          <Box
            height="80vh"
            backgroundImage="url('https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241021054156.jpg')"
            backgroundSize="cover"
            backgroundPosition="center"
            color="#ddd"
            p={4}
          >
            <Box textAlign="left" ml="5%">
              <Box fontSize="18px" mb={4}>
                {getMessage({
                  ja: "まとめ",
                  language,
                })}
              </Box>
              <Box fontSize="14px">
                <Text>
                  {getMessage({
                    ja: "検査履歴システム用にポイントが点滅するように作った例です。",
                    us: "This is an example of making points blink for an inspection history system.",
                    cn: "检查履历系统的闪光点示例。",
                    language,
                  })}
                </Text>
                <Text>
                  {getMessage({
                    ja: "他にも使用するアイデアがあればご意見ください。",
                    us: "If you have other ideas for use, please let us know.",
                    cn: "如果您有其他使用想法，请向我们提出建议。",
                    language,
                  })}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
};

export default ScrollableContent;
