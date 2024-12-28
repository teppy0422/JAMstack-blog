import React from "react";
import { useLanguage } from "../context/LanguageContext";

type MessageDisplayProps = {
  ja: string;
  en: string;
  wf: string;
};

const MessageDisplay: React.FC<MessageDisplayProps> = ({ ja, en, wf }) => {
  const { language } = useLanguage(); // フックをコンポーネント内で使用

  const message =
    language === "ja"
      ? ja
      : language === "en"
      ? en
      : language === "wf"
      ? wf
      : "";

  return <>{message}</>;
};

export default MessageDisplay;
