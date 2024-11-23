import React, { useEffect } from "react";
// import "./assets/reset.css";
import "./ICT/style.css";
import "@fontsource/noto-sans-jp";
import "@fontsource/rock-salt";

const ICT: React.FC = () => {
  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    console.log("Start button clicked");

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
            この活動に対する考え方
          </a>
        </div>
      </main>
      <div className="cd-modal">
        <div className="modal-content">
          <h1 className="title">What we can do?</h1>
          <p className="p-custom-font">
            平安時代、文字の読み書きというのは一部の人だけに許された特別な技術でした。
            <br />
            読み書きが出来ない人は、文字を扱う専門家を雇ってその思いを手紙にしていました。
            <br />
            <br />
            そんな日本が、文字の読み書きは当たり前になり100年以上も世界一の識字率を誇り続けています。
            <br />
            <br />
            そして現代、だれもがスマートフォンやパソコンを使って、買い物をしたり、遠くはなれた誰かと会話が出来るようになりました。
            <br />
            <br />
            でも、それらを自由自在に使いこなす為に必要なプログラミングなどのICT(情報処理技術)を身につけている人は、実はあまり多くありません。
            <br />
            <br />
            かつて専門家に任せていた読み書きを、だれもが当たり前にできる世の中になったように、
            近い将来、限られた専門家でなくても、ICTを当たり前に使いこなす時代がやってくるかもしれません。
            <br />
            <br />
            そんな時代の到来に備え、
            <br />
            今、ICTを身につけるための取り組みが、
            <br />
            世界各地の教育機関で始まろうとしています。
            <br />
            <br />
            将来みんながプログラマーになるから学習するのでなく
            <br />
            全てに共通する「効率良く物事を考える」に繋がるから基礎能力として注目されています。
            <br />
            クリスティアーノロナウドは小学生の子供に効率良くサッカーを上手くなってもらう為にまずICTを学ばせました。
            <br />
            <br />
            このPLUS+の考え方を進めるにはICTのスキルが欠かせません。
            <br />
            言い方を変えれば、PLUS+に参加する事でICTのスキルが身に付きます。
            <br />
            <br />
            人件費が3分の1の海外国と直接作業効率で勝負しても勝ち目はありません。
            <br />
            3倍の速さで作業をしたら身体が壊れるからです。
            <br />
            対してICTの技術力を上げれば間接作業効率100倍を容易に実現できます。
            <br />
            <br />
            もちろんICTのスキルだけでは業務改善は実現しません。
            <br />
            特に現場とのコミュニケーション能力が課題になってきます。
            <br />
            今、そういった総合スキルを持ったエンジニアの育成が国内に工場を残す価値に繋がるのではないでしょうか。
            <br />
            その育成の為のツールとしてPLUS+が活用されたら幸いです。
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
