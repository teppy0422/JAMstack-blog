import React, { useContext } from "react";
import { AppContext } from "../pages/_app";

type MessageDisplayProps = {
  ja: string;
  us: string;
  cn: string;
};

const MessageDisplay: React.FC<MessageDisplayProps> = ({ ja, us, cn }) => {
  const { language, setLanguage } = useContext(AppContext);

  const message =
    language === "ja"
      ? ja
      : language === "us"
      ? us
      : language === "cn"
      ? cn
      : "";

  return <>{message}</>;
};

export default MessageDisplay;
