"use client";

import React, { useEffect, useContext } from "react";
// import "./assets/reset.css";
import "./style.css";
import "@fontsource/rock-salt";

import { useLanguage } from "../../../../context/LanguageContext";
import getMessage from "../../../../components/getMessage";

const ICT: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    // transitionLayerとmodalWindowの処理をここに移動
    const transitionLayer = document.querySelector(".cd-transition-layer");
    const modalWindow = document.querySelector(".cd-modal");

    if (transitionLayer) {
      transitionLayer.classList.add("visible", "opening");
    }
    const delay =
      document.querySelectorAll(".no-cssanimations").length > 0 ? 0 : 600;
    setTimeout(() => {
      if (modalWindow) {
        modalWindow.classList.add("visible");
      }
    }, delay);
  };
  // offClickハンドラーを定義
  const offClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const transitionLayer = document.querySelector(".cd-transition-layer");
    const modalWindow = document.querySelector(".cd-modal");
    const transitionBackground = document.querySelector(".bg-layer");

    if (transitionLayer) {
      transitionLayer.classList.add("closing");
    }
    if (modalWindow) {
      modalWindow.classList.remove("visible");
    }
    if (transitionBackground) {
      transitionBackground.addEventListener("animationend", function handler() {
        if (transitionLayer) {
          transitionLayer.classList.remove("closing", "opening", "visible");
        }
        transitionBackground.removeEventListener("animationend", handler);
      });
    }
  };
  return (
    <div>
      <main className="cd-main-content">
        <div className="center">
          <a href="#0" className="cd-btn cd-modal-trigger" onClick={onClick}>
            {getMessage({
              ja: "この活動に対する考え方",
              us: "Our approach to this activity",
              cn: "对这项活动的看法。",
              language,
            })}
          </a>
        </div>
      </main>
      <div className="cd-modal">
        <div className="modal-content">
          <h1 className="title">What we can do?</h1>
          <p className="p-custom-font">
            {getMessage({
              ja: "平安時代、文字の読み書きというのは一部の人だけに許された特別な技術でした。",
              us: "In the past, reading and writing were special skills reserved for a select few.",
              cn: "过去，阅读和写作是少数人的特殊技能。",
              language,
            })}
            <br />
            {getMessage({
              ja: "読み書きが出来ない人は、文字を扱う専門家を雇ってその思いを手紙にしていました。",
              us: "Those who could not read or write would hire a specialist to handle their letters and write their thoughts in letters.",
              cn: "那些不识字的人则聘请专人处理信件，并将自己的想法写在信中。",
              language,
            })}
            <br />
            <br />
            {getMessage({
              ja: "そんな日本が、文字の読み書きは当たり前になり100年以上も世界一の識字率を誇り続けています。",
              us: "Literacy rates around the world continue to rise",
              cn: "全世界的识字率持续上升。",
              language,
            })}
            <br />
            <br />
            {getMessage({
              ja: "そして現代、だれもがスマートフォンやパソコンを使って、買い物をしたり、遠くはなれた誰かと会話が出来るようになりました。",
              us: "Today, anyone can use a smartphone or computer to shop and talk with someone far away.",
              cn: "如今，任何人都可以使用智能手机或电脑购物，并与远方的人交谈。",
              language,
            })}
            <br />
            <br />
            {getMessage({
              ja: "でも、それらを自由自在に使いこなす為に必要なプログラミングなどのICT(情報処理技術)を身につけている人は、実はあまり多くありません。",
              us: "However, not many people have the ICT (information processing technology), such as programming, necessary to use them at will.",
              cn: "但是，真正掌握编程和其他 ICT（信息处理技术）以随意使用它们的人并不多。",
              language,
            })}
            <br />
            <br />
            {getMessage({
              ja: "かつて専門家に任せていた読み書きを、だれもが当たり前にできる世の中になったように、近い将来、限られた専門家でなくても、ICTを当たり前に使いこなす時代がやってくるかもしれません。",
              us: "Just as we now live in a world where everyone can read and write in a way that was once left to specialists, we may soon live in an age where ICT can be taken for granted by anyone, even by a limited number of specialists.",
              cn: "就像在过去只有专家才能读写的世界里，现在人人都能读写一样，在不久的将来，信息和传播技术甚至会被少数非专业人士视为理所当然的东西。",
              language,
            })}
            <br />
            <br />
            {getMessage({
              ja: "そんな時代の到来に備え、",
              us: "Prepare for the arrival of such an era,",
              cn: "为这样一个时代的到来做好准备、",
              language,
            })}
            <br />
            {getMessage({
              ja: "今、ICTを身につけるための取り組みが、",
              us: "Now, the initiative to acquire ICT,",
              cn: "现在，获得信息和通信技术的倡议、",
              language,
            })}
            <br />
            {getMessage({
              ja: "世界各地の教育機関で始まろうとしています。",
              us: "It is about to begin in educational institutions around the world.",
              cn: "它即将在世界各地的教育机构中开始。",
              language,
            })}
            <br />
            <br />
            {getMessage({
              ja: "将来みんながプログラマーになるから学習するのでなく",
              us: "Not learning because everyone will be a programmer in the future.",
              cn: "不是每个人都会学习，因为他们将来都会成为程序员。",
              language,
            })}
            <br />
            {getMessage({
              ja: "全てに共通する「効率良く物事を考える」に繋がるから基礎能力として注目されています。",
              us: "It is attracting attention as a basic ability because it leads to 'thinking things through efficiently,' which is common to all.",
              cn: "这是一项基本技能，因其能带来 '高效思考' 而备受关注，这也是所有人的共性。",
              language,
            })}
            <br />
            {getMessage({
              ja: "クリスティアーノロナウドは小学生の子供に効率良くサッカーを上手くなってもらう為にまずICTを学ばせました。",
              us: "Cristiano Ronaldo made his elementary school children learn ICT first in order to help them become better soccer players efficiently.",
              cn: "克里斯蒂亚诺-罗纳尔多首先让他的小学生学习信息和通信技术，以帮助他们高效地成为更好的足球运动员。",
              language,
            })}
            <br />
            <br />
            {getMessage({
              ja: "このPLUS+の考え方を進めるにはICTのスキルが欠かせません。",
              us: "ICT skills are essential to advance this PLUS+ concept.",
              cn: "信息和通信技术技能对于推进这一 PLUS+ 方法至关重要。",
              language,
            })}
            <br />
            {getMessage({
              ja: "言い方を変えれば、PLUS+に参加する事でICTのスキルが身に付きます。",
              us: "In other words, by participating in PLUS+, you will acquire ICT skills.",
              cn: "换句话说，通过参加 PLUS+，培养了信息和通信技术技能。",
              language,
            })}
            <br />
            <br />
            {getMessage({
              ja: "人件費が3分の1の海外国と直接作業効率で勝負しても勝ち目はありません。",
              us: "There is no way to win if we compete directly with foreign countries, whose labor costs are one-third of ours, on the basis of work efficiency.",
              cn: "在工作效率方面，如果直接与劳动力成本只有其三分之一的外国竞争，是不可能取胜的。",
              language,
            })}
            <br />
            {getMessage({
              ja: "3倍の速さで作業をしたら身体が壊れるからです。",
              us: "This is because if you work three times as fast, your body will break down.",
              cn: "这是因为，如果你以三倍的速度工作，你的身体就会垮掉。",
              language,
            })}
            <br />
            {getMessage({
              ja: "対してICTの技術力を上げれば間接作業効率100倍を容易に実現できます。",
              us: "In contrast, if the technical capabilities of ICT are increased, a 100-fold increase in indirect work efficiency can easily be achieved.",
              cn: "相比之下，提高信息和通信技术的技术能力可以轻松地将间接工作效率提高 100 倍。",
              language,
            })}
            <br />
            <br />
            {getMessage({
              ja: "もちろんICTのスキルだけでは業務改善は実現しません。",
              us: "Of course, ICT skills alone are not enough to improve business operations.",
              cn: "当然，要实现业务改进，仅靠信息和通信技术技能是不够的。",
              language,
            })}
            <br />
            {getMessage({
              ja: "特に現場とのコミュニケーション能力が課題になってきます。",
              us: "In particular, the ability to communicate with the field will be a challenge.",
              cn: "与实地沟通的能力是一项特殊的挑战。",
              language,
            })}
            <br />
            {getMessage({
              ja: "今、そういった総合スキルを持ったエンジニアの育成が国内に工場を残す価値に繋がるのではないでしょうか。",
              us: "Now, I believe that training engineers with such comprehensive skills will lead to the value of keeping factories in Japan.",
              cn: "现在，培养出具备这种综合技能的工程师，将为把工厂留在国内带来价值。",
              language,
            })}
            <br />

            {getMessage({
              ja: "その育成の為のツールとしてPLUS+が活用されたら幸いです。",
              us: "We hope that PLUS+ will be used as a tool for their development.",
              cn: "我们希望 PLUS+ 成为他们发展的工具。",
              language,
            })}
          </p>
        </div>
        <a href="#0" className="modal-close" onClick={offClick}>
          Close
        </a>
      </div>
      <div className="cd-transition-layer">
        <div className="bg-layer"></div>
      </div>
    </div>
  );
};

export default ICT;
