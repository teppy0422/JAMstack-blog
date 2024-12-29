import React, { useContext } from "react";
import { AppContext } from "../pages/_app";

type MessageDisplayProps = {
  ja: string;
  us: string;
  cn: string;
  language: string;
};

const getMessage = ({ ja, us, cn, language }: MessageDisplayProps): string => {
  switch (language) {
    case "ja":
      return ja;
    case "us":
      return us;
    case "cn":
      return cn;
    default:
      return us; // デフォルトは英語
  }
};

export default getMessage;
