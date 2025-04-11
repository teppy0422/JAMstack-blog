import React from "react";
import { Box, Text } from "@chakra-ui/react";
import styles from "../../../styles/home.module.scss";

interface ContentDisplayProps {
  content: string | null; // contextから渡されるcontent
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content }) => {
  const cleanContent = (html: string | null) => {
    if (!html) return ""; // nullの場合は空の文字列を返す

    // DOMParserを使用してHTMLをパース
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // <body>内の内容を取得
    return doc.body.innerHTML;
  };

  return (
    <>
      {content ? (
        <div
          className={styles.post}
          dangerouslySetInnerHTML={{ __html: cleanContent(content) }}
          style={{
            height: "100%",
            width: "100%",
            margin: 0,
            padding: 0,
          }}
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </>
  );
};

export default ContentDisplay;
