"use client";

import React, { useRef, useState, useEffect } from "react";
import { Box, Image, useDisclosure, Flex, Text } from "@chakra-ui/react";

import CustomModalTab from "../../parts/CustomModalTab";
import CustomModal from "@/components/ui/CustomModal";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import AnimatedListItem from "./AnimatedListItem";

export function Modal40() {
  const { language, setLanguage } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef<HTMLLIElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const checkInView = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= window.innerHeight) {
        setInView(true);
      }
    };

    const scrollContainer = document.querySelector(
      ".your-scroll-container-selector"
    );
    scrollContainer?.addEventListener("scroll", checkInView);
    checkInView(); // 初回チェック

    return () => {
      scrollContainer?.removeEventListener("scroll", checkInView);
    };
  }, []);

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
        path="./tabs/40/"
        text="40.サブ図"
        media="html"
        onOpen={onOpen}
      />
      <CustomModal
        title={
          "40." +
          getMessage({
            ja: "サブ図",
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
                ja: "最短時間で写真ベースのサブ図を作成",
                us: "Create photo-based Subfigure in the shortest possible time",
                cn: "在最短时间内绘制基于照片的子图纸。",
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
          <Flex py="10px" px="20px" w="100%" direction="column" gap="30px">
            <Flex justifyContent="flex-start">
              <Box maxW="40%">
                <AnimatedListItem direction="left">
                  <Box backgroundColor="#f0f0f0" borderRadius="14px" p={1}>
                    <img
                      src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020104652.png"
                      alt="説明画像1"
                    />
                  </Box>
                  <Text fontSize="13px" py="4px">
                    <CircleBadge label="1" />
                    {getMessage({
                      ja: "先ハメ工程が1つの場合は枠線が朱色で先ハメ、それ以外は後ハメです",
                      us: "If there is only one process, \nthe border line is in vermilion and it is the first frame, \notherwise it is the second frame.",
                      cn: "如果只有一个第一帧流程，边界线为朱红色，则为第一帧流程，否则为第二帧流程",
                      language,
                    })}
                    <br />
                    <CircleBadge label="2" />
                    {getMessage({
                      ja: "右下の",
                      us: "",
                      cn: "右下角的",
                      language,
                    })}
                    <Box
                      as="span"
                      mx="3px"
                      style={{
                        color: "#ff4f4f",
                        textShadow: `
                        1px 1px 0 #fff,
                        -1px -1px 0 #fff,
                        -1px 1px 0 #fff,
                        1px -1px 0 #fff
                      `,
                        fontWeight: 600,
                      }}
                    >
                      2-1
                    </Box>
                    {getMessage({
                      ja: "は先ハメ数と後ハメ数を表しています",
                      us: " in the lower right represents the number of first frames and the number of second frames",
                      cn: "表示第一帧和第二帧的数量",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="flex-end">
              <Box maxW="45%">
                <AnimatedListItem direction="right">
                  <Box
                    backgroundColor="#f0f0f0"
                    borderRadius="14px"
                    p={1}
                    pl={0}
                  >
                    <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020113903.png" />
                  </Box>
                  <Text fontSize="13px" py="4px">
                    <CircleBadge label="3" />
                    {getMessage({
                      ja: "先ハメ時に付属部品がある場合は下に表示されます",
                      us: "If there are attached parts at the time of pre-fabrication,\n they will be shown below.",
                      cn: "如果在预锤击时有附加部件，则显示如下",
                      language,
                    })}
                    <br />
                    <CircleBadge label="4" />
                    {getMessage({
                      ja: "シールド線の場合は電線サイズはSとして表示されます",
                      us: "For shielded wires, wire size is shown as S",
                      cn: "对于屏蔽导线，导线尺寸显示为 S",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="flex-start">
              <Box maxW="50%">
                <AnimatedListItem direction="left">
                  <Box backgroundColor="#f0f0f0" borderRadius="6px" p={1}>
                    <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020120114.png" />
                  </Box>
                  <Text fontSize="13px" py="4px">
                    <CircleBadge label="5" />
                    {getMessage({
                      ja: "金メッキ端子を含む場合は下に警告が表示されます",
                      us: "If gold-plated terminals are included,\na warning will appear below",
                      cn: "如果包括镀金端子，下面会显示警告信息",
                      language,
                    })}
                    <br />
                    <CircleBadge label="6" />
                    {getMessage({
                      ja: "全て先ハメの場合はロック締めの表示とロック締め方向が表示されます",
                      us: "In the case of all first-fastening,\nlock tightening indication and lock tightening direction are displayed.",
                      cn: "如果都是先拧紧，则会显示锁的拧紧情况和拧紧方向",
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
                    <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020130734.png" />
                  </Box>
                  <Text fontSize="13px" py="4px">
                    <CircleBadge label="7" />
                    {getMessage({
                      ja: "ツイスト線はTwと表示されます",
                      us: "Twisted wires are marked as Tw",
                      cn: "双绞线标记为 Tw",
                      language,
                    })}
                    <br />
                    <CircleBadge label="8" />
                    {getMessage({
                      ja: "詰栓は ",
                      us: "Plugs are marked with ",
                      cn: "插头标有 ",
                      language,
                    })}
                    <span
                      style={{
                        fontSize: "28px",
                        fontFamily: "MS PGothic",
                        display: "inline-block",
                        paddingLeft: "2px",
                        paddingRight: "2px",
                        verticalAlign: "middle",
                      }}
                    >
                      *
                    </span>
                    {getMessage({
                      ja: " で表現されその部品品番は下方に表示されます",
                      us: " and the part number is shown below",
                      cn: "，零件编号如下所示",
                      language,
                    })}
                    <br />
                    <CircleBadge label="9" />
                    {getMessage({
                      ja: "両端が先ハメの場合は構成Noの下にアンダーバーが表示されます",
                      us: "If both ends are first-hammer, an underscore will appear under the configuration No.",
                      cn: "如果两端都是先锤击，则配置编号下会出现一个下杠。",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="flex-start">
              <Box maxW="40%">
                <AnimatedListItem direction="left">
                  <Box
                    backgroundColor="#fff"
                    borderRadius="10px"
                    p={1}
                    pr={0}
                    pb={0}
                    overflow="hidden"
                  >
                    <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020134753.png" />
                  </Box>
                  <Text fontSize="13px" py="4px">
                    <CircleBadge label="10" />
                    {getMessage({
                      ja: "ボンダーは上記のように表現されます",
                      us: "Bonder is represented as above",
                      cn: "Bonder 表示如上。",
                      language,
                    })}
                    <br />
                    <CircleBadge label="11" />
                    {getMessage({
                      ja: "電線情報は下に表示されて線長順に行き先の端末Noが表示されます",
                      us: "Wire information is displayed at the bottom and the destination terminal No. is displayed in order of wire length",
                      cn: "导线信息显示如下，并按导线长度顺序显示目的端子编号",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="flex-end">
              <Box maxW="40%">
                <AnimatedListItem direction="right">
                  <Box
                    backgroundColor="#fff"
                    borderRadius="10px"
                    p={1}
                    pr={0}
                    overflow="hidden"
                  >
                    <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020161047.png" />
                  </Box>
                  <Text fontSize="13px" py="4px">
                    <CircleBadge label="12" />
                    {getMessage({
                      ja: "ダブり圧着もボンダーと同じ表現です",
                      us: "Dab crimping is also expressed the same way as bonder",
                      cn: "点焊压接的表达方式也与邦德相同。",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="flex-start">
              <Box maxW="45%">
                <AnimatedListItem direction="left">
                  <Box backgroundColor="#f0f0f0" borderRadius="12px" p={1}>
                    <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020141309.png" />
                  </Box>
                  <Text fontSize="13px" py="4px">
                    <CircleBadge label="13" />
                    {getMessage({
                      ja: "オス端子の場合は周囲に点線が表示されます",
                      us: "For male terminals, a dotted line is shown around the terminal.",
                      cn: "对于公端子，其周围会显示一条虚线。",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="flex-end">
              <Box maxW="65%">
                <AnimatedListItem direction="right">
                  <Box backgroundColor="#f0f0f0" borderRadius="8px" p={1}>
                    <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020155525.png" />
                  </Box>
                  <Text fontSize="13px" py="4px">
                    <CircleBadge label="14" />
                    {getMessage({
                      ja: "グループでハメ図を作成する事も可能です。治具に貼る後ハメ図にお勧めです",
                      us: "It is also possible to create a group drawing. Recommended for post-fabrication drawings to be attached to jigs.",
                      cn: "也可以分组创建框架图。建议将后框架图附在夹具上。",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="flex-start">
              <Box maxW="60%">
                <AnimatedListItem direction="left">
                  <Box backgroundColor="#f0f0f0" borderRadius="4px" p={1}>
                    <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020151609.png" />
                  </Box>
                  <Text fontSize="13px" py="4px">
                    <CircleBadge label="15" />
                    {getMessage({
                      ja: "ハメ図は選択式で作成。52920パターンあります(2024/10/20 現在)",
                      us: "Fittingfigure is made by choice. 52920 patterns are available (as of 2024/10/20).",
                      cn: "装图根据选择制作的；共有 52920 种图案（截至 2024/10/20）。",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
            <Flex justifyContent="center">
              <Box maxW="90%">
                <AnimatedListItem direction="bottom">
                  <Box backgroundColor="#fff" borderRadius="4px" p={1}>
                    <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020163045.png" />
                  </Box>
                  <Text fontSize="13px" py="4px">
                    {getMessage({
                      ja: "サブ図は上のようになります",
                      us: "Subfigure will look like above",
                      cn: "子图将与上图相似",
                      language,
                    })}
                  </Text>
                </AnimatedListItem>
              </Box>
            </Flex>
          </Flex>
          <div
            style={{
              height: "80vh",
              backgroundImage:
                "url('https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241021054156.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "#fff",
              margin: "0",
              marginTop: "20px",
            }}
          >
            <div style={{ textAlign: "left", marginLeft: "5%", padding: "3%" }}>
              <h1
                style={{
                  textAlign: "left",
                  marginBottom: "10px",
                  marginTop: "10px",
                  color: "#fff",
                  textShadow: "none",
                  fontWeight: "bold",
                }}
              >
                {getMessage({
                  ja: "まとめ",
                  language,
                })}
              </h1>
              <h3
                style={{
                  textAlign: "left",
                  color: "#fff",
                  textShadow: "none",
                  fontWeight: "200",
                }}
              >
                {getMessage({
                  ja: "現場や生準の意見を基に機能を追加しています。",
                  us: "Functions are added based on field and live standard input.",
                  cn: "根据现场和实时反馈增加功能。",
                  language,
                })}
                <br />
                {getMessage({
                  ja: "選択肢を増やす方法で更新しています。",
                  us: "We are updating it in a way that will give you more options.",
                  cn: "更新的方式增加了选择。",
                  language,
                })}
                <br />
                {getMessage({
                  ja: "作業現場の必要に応じて選択して作ってみてください。",
                  us: "Select and make as needed for your work site.",
                  cn: "根据工作地点的需要进行选择和制作。",
                  language,
                })}
                <br />
                <br />

                {getMessage({
                  ja: "選択肢の追加については問い合わせフォームからご意見ください。",
                  us: "Please use the contact form to provide feedback on additional options.",
                  cn: "如需其他选项，请通过联系表提供反馈。",
                  language,
                })}
              </h3>
            </div>
            <Image
              src="/images/hippo.gif"
              alt="Hippo"
              style={{
                position: "absolute",
                bottom: "40px",
                right: "10px",
                width: "50px",
              }}
            />
          </div>
        </Box>
      </CustomModal>
    </>
  );
}

export default Modal40;
