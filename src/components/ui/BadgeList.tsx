"use client";

import { Badge, HStack } from "@chakra-ui/react";
import { getColor } from "@/lib/getColor";

type BadgesProps = {
  labels: string[];
  useGetColor?: boolean[];
};

const BadgeList = ({ labels, useGetColor }: BadgesProps) => {
  return (
    <HStack spacing={1} wrap="wrap" mt={1}>
      {labels.map((label, index) => {
        const useColor = useGetColor?.[index] ?? true; // デフォルトで true
        const { bg, color, borderColor } = useColor
          ? getColor(label)
          : { bg: "transparent", color: "gray", borderColor: "gray" };
        return (
          <Badge
            key={index}
            bg={bg}
            color={color}
            border="1px solid"
            borderColor={borderColor}
            lineHeight={1.2}
            px={1}
            py={0}
            mr={0.5}
            fontSize="12px"
            textTransform="none"
          >
            {label}
          </Badge>
        );
      })}
    </HStack>
  );
};

export default BadgeList;
