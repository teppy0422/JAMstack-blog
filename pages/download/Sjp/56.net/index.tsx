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
          title={getMessage({
            ja: "ディスプレイ移動",
            us: "Display Movement",
            cn: "显示屏移动",
            language,
          })}
          date="2018/7/22"
          src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/uploads/public/20241018150130.mp4"
          autoPlay={true}
          textContent={getMessage({
            ja: `
配策時にディスプレイが見えやすい位置に移動します。
治具が横に長くディスプレイが見えない位置になる事があるので作成しました。

56.配策誘導ナビで作成した座標データを基に移動します。

Arduinoとステッピングモーターで移動させています。

						
`,
            us: `The display is moved to a position where it is easy to see it when it is placed.
The jig is long horizontally and the display is sometimes not visible, so it was created.

Moves based on the coordinate data created by the "Layout Guidance Navigation" function.

It is moved by Arduino and stepping motors.


`,
            cn: `在展开时移动到显示屏容易看到的位置。
这是因为夹具水平方向较长，而显示屏有时处于无法看到的位置。

根据 56 创建的坐标数据移动。

通过 Arduino 和步进电机移动。


`,
            language,
          })}
        />
      </IpadFrame>
    </ChakraProvider>
  );
};

export default HomePage;
