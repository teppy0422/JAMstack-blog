import { AnimationType } from "framer-motion";

// app/data/storybooks.ts
export const storybooks = [
  {
    id: "animals",
    title: "どうぶつえほん",
    cover: "/images/illust/hippo/hippo_001.png",
    pages: [
      {
        image: "/images/storybook/dog.gif",
        text: "わん！",
        sound: "/sound/storybook/bowwow.mp3",
        AnimationType: "jump",
      },
      {
        image: "/images/storybook/cat.gif",
        text: "にゃー！",
        sound: "/sound/storybook/nya.mp3",
      },
    ],
  },
  // 他の絵本も追加できる
];
