import { Badge } from "@chakra-ui/react";
import React from "react";

export const CustomBadge: React.FC<{ text: string }> = ({ text }) => {
  switch (text) {
    case "生準+":
      return (
        <Badge variant="outline" bg="green.500" color="white" mr={1}>
          生準+
        </Badge>
      );
    case "開発":
      return (
        <Badge bg="red.500" color="white" mr={1}>
          開発
        </Badge>
      );
    // 他のケースを追加
    default:
      return (
        <Badge bg="gray.500" color="white" mr={1}>
          {text}
        </Badge>
      );
  }
};
export default CustomBadge;
