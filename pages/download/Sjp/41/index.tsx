import React from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";

import YouTubePlayer from "../../../../components/youtube";
import IpadFrame from "../../../../components/ipad";

import { useLanguage } from "../../../../context/LanguageContext";
import getMessage from "../../../../components/getMessage";

const HomePage: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <ChakraProvider>
      <IpadFrame>
        <YouTubePlayer
          title={
            "41." +
            getMessage({
              ja: "先ハメ誘導の使い方",
              us: "How to use the Pre-Fitting Guidance",
              cn: "如何使用 先装引导",
              language,
            })
          }
          date="2021/3/24"
          autoPlay={true}
          src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241018145058.mp4"
          textContent={getMessage({
            ja: `先ハメ初心者でも最適な順番で作業が行えます。
製造指示書にサブナンバーと作業順を印刷してその順番で作業を行います。
						
※先ハメ順を都度考える補給品工程で特に有効です
※生産準備+で自動立案したサブ形態のみ対応`,
            us: `Even beginners can work in the best order.
Sub-numbers and work order are printed on the manufacturing instructions and the work is performed in that order.

This is especially effective in the supply process where the first frame order is considered on a case-by-case basis.
Only the sub forms automatically drafted by Production Preparation+ are supported.`,
            cn: `即使是初学者也能按照最佳顺序工作。
在生产说明书上打印子编号和工作顺序，然后按此顺序工作。

*在供应过程中尤其有效，可根据具体情况考虑第一个框架订单。
*仅与 Production Preparation+ 自动编制的子表格兼容。

`,
            language,
          })}
        />
      </IpadFrame>
    </ChakraProvider>
  );
};

export default HomePage;
