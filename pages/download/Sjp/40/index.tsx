import React, { useEffect } from "react";
import Head from "next/head";
import { Box, Image } from "@chakra-ui/react";
import "./style.css";

import IpadFrame from "../../../../components/ipad";

import { useLanguage } from "../../../../context/LanguageContext";
import getMessage from "../../../../components/getMessage";

const Index: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <>
      <IpadFrame>
        <div
          style={{
            width: "90vw",
            overflowX: "hidden",
            height: "90vh",
          }}
          className="body_"
        >
          <h2 style={{ margin: "0em", fontSize: "18px" }}>
            {"40." +
              getMessage({
                ja: "サブ図",
                language,
              })}
          </h2>
          <h4>
            {getMessage({
              ja: "最短時間で写真ベースのサブ図を作成",
              us: "Create photo-based Subfigure in the shortest possible time",
              cn: "在最短时间内绘制基于照片的子图纸。",
              language,
            })}
          </h4>
          <p style={{ marginTop: "4vh" }}>
            {getMessage({
              ja: "スクロールしてください",
              us: "Please scroll down.",
              cn: "滚动到",
              language,
            })}
          </p>
          <div className="container" style={{ marginTop: "15vh" }}>
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
                fill="#000"
              />
            </svg>
          </div>
          <ul className="box">
            <li className="scroll_left" style={{ maxWidth: "40vw" }}>
              <img
                src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020104652.png"
                alt="説明画像1"
              />
              <h4 style={{ textAlign: "left" }}>
                <span className="tag">1</span>
                {getMessage({
                  ja: "先ハメ工程が1つの場合は枠線が朱色で先ハメ、それ以外は後ハメです",
                  us: "If there is only one process, \nthe border line is in vermilion and it is the first frame, \notherwise it is the second frame.",
                  cn: "如果只有一个第一帧流程，边界线为朱红色，则为第一帧流程，否则为第二帧流程",
                  language,
                })}
                <br />
                <span className="tag">2</span>
                {getMessage({
                  ja: "右下の",
                  us: "",
                  cn: "右下角的",
                  language,
                })}
                <span style={{ color: "#ff4f4f" }}>2-1</span>
                {getMessage({
                  ja: "は先ハメ数と後ハメ数を表しています",
                  us: " in the lower right represents the number of first frames and the number of second frames",
                  cn: "表示第一帧和第二帧的数量",
                  language,
                })}
              </h4>
            </li>
            <li className="scroll_right" style={{ maxWidth: "40vw" }}>
              <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020113903.png" />
              <h4 style={{ textAlign: "left" }}>
                <span className="tag">3</span>
                {getMessage({
                  ja: "先ハメ時に付属部品がある場合は下に表示されます",
                  us: "If there are attached parts at the time of pre-fabrication,\n they will be shown below.",
                  cn: "如果在预锤击时有附加部件，则显示如下",
                  language,
                })}
                <br />
                <span className="tag">4</span>
                {getMessage({
                  ja: "シールド線の場合は電線サイズはSとして表示されます",
                  us: "For shielded wires, wire size is shown as S",
                  cn: "对于屏蔽导线，导线尺寸显示为 S",
                  language,
                })}
              </h4>
            </li>
            <li className="scroll_left" style={{ maxWidth: "40vw" }}>
              <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020120114.png" />
              <h4 style={{ textAlign: "left" }}>
                <span className="tag">5</span>
                {getMessage({
                  ja: "金メッキ端子を含む場合は下に警告が表示されます",
                  us: "If gold-plated terminals are included,\na warning will appear below",
                  cn: "如果包括镀金端子，下面会显示警告信息",
                  language,
                })}
                <br />
                <span className="tag">6</span>
                {getMessage({
                  ja: "全て先ハメの場合はロック締めの表示とロック締め方向が表示されます",
                  us: "In the case of all first-fastening,\nlock tightening indication and lock tightening direction are displayed.",
                  cn: "如果都是先拧紧，则会显示锁的拧紧情况和拧紧方向",
                  language,
                })}
              </h4>
            </li>
            <li className="scroll_right" style={{ maxWidth: "60vw" }}>
              <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020130734.png" />
              <h4 style={{ textAlign: "left" }}>
                <span className="tag">7</span>
                {getMessage({
                  ja: "ツイスト線はTwと表示されます",
                  us: "Twisted wires are marked as Tw",
                  cn: "双绞线标记为 Tw",
                  language,
                })}
                <br />
                <span className="tag">8</span>
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
                    position: "relative",
                    top: "4px",
                    paddingLeft: "2px",
                    paddingRight: "2px",
                  }}
                >
                  *
                </span>
                {getMessage({
                  ja: " と表示されて部品品番は下方に表示されます",
                  us: " and the part number is shown below",
                  cn: "，零件编号如下所示",
                  language,
                })}
                <br />
                <span className="tag">9</span>
                {getMessage({
                  ja: "両端が先ハメの場合は構成Noの下にアンダーバーが表示されます",
                  us: "If both ends are first-hammer, an underscore will appear under the configuration No.",
                  cn: "如果两端都是先锤击，则配置编号下会出现一个下杠。",
                  language,
                })}
              </h4>
            </li>
            <li className="scroll_left" style={{ maxWidth: "30vw" }}>
              <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020134753.png" />
              <h4 style={{ textAlign: "left" }}>
                <span className="tag">10</span>
                {getMessage({
                  ja: "ボンダーは上記のように表現されます",
                  us: "Bonder is represented as above",
                  cn: "Bonder 表示如上。",
                  language,
                })}
                <br />
                <span className="tag">11</span>
                {getMessage({
                  ja: "電線情報は下に表示されて線長順に行き先の端末Noが表示されます",
                  us: "Wire information is displayed at the bottom and the destination terminal No. is displayed in order of wire length",
                  cn: "导线信息显示如下，并按导线长度顺序显示目的端子编号",
                  language,
                })}
              </h4>
            </li>
            <li className="scroll_right" style={{ maxWidth: "30vw" }}>
              <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020161047.png" />
              <h4 style={{ textAlign: "left" }}>
                <span className="tag">12</span>
                {getMessage({
                  ja: "ダブり圧着もボンダーと同じ表現です",
                  us: "Dab crimping is also expressed the same way as bonder",
                  cn: "点焊压接的表达方式也与邦德相同。",
                  language,
                })}
              </h4>
            </li>
            <li className="scroll_left" style={{ maxWidth: "30vw" }}>
              <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020141309.png" />
              <h4 style={{ textAlign: "left" }}>
                <span className="tag">13</span>
                {getMessage({
                  ja: "オス端子の場合は周囲に点線が表示されます",
                  us: "For male terminals, a dotted line is shown around the terminal.",
                  cn: "对于公端子，其周围会显示一条虚线。",
                  language,
                })}
              </h4>
            </li>
            <li className="scroll_right" style={{ maxWidth: "30vw" }}>
              <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020155525.png" />
              <h4 style={{ textAlign: "left" }}>
                <span className="tag">14</span>
                {getMessage({
                  ja: "グループでハメ図を作成する事も可能です。治具に貼る後ハメ図にお勧めです",
                  us: "It is also possible to create a group drawing. Recommended for post-fabrication drawings to be attached to jigs.",
                  cn: "也可以分组创建框架图。建议将后框架图附在夹具上。",
                  language,
                })}
              </h4>
            </li>
            <li className="scroll_left" style={{ maxWidth: "30vw" }}>
              <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020151609.png" />
              <h4 style={{ textAlign: "left" }}>
                <span className="tag">15</span>
                {getMessage({
                  ja: "ハメ図は選択式で作成。52920パターンあります(2024/10/20 現在)",
                  us: "Fittingfigure is made by choice. 52920 patterns are available (as of 2024/10/20).",
                  cn: "装图根据选择制作的；共有 52920 种图案（截至 2024/10/20）。",
                  language,
                })}
              </h4>
            </li>
            <li className="scroll_up" style={{ maxWidth: "50vw" }}>
              <img src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241020163045.png" />
              <h4>
                {getMessage({
                  ja: "サブ図は上のようになります",
                  us: "Subfigure will look like above",
                  cn: "子图将与上图相似",
                  language,
                })}
              </h4>
            </li>
          </ul>
          <div
            style={{
              height: "90vh",
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
                  fontWeight: "bold",
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
                bottom: "10px",
                right: "10px",
                width: "50px",
              }}
            />
          </div>
        </div>
      </IpadFrame>
    </>
  );
};

export default Index;
