import { Box, BoxProps, useToken } from "@chakra-ui/react";

interface KeyProps extends BoxProps {
  children: React.ReactNode;
  baseColor?: string; // 基準色を指定（gray, blue, red など）
}

export const Key = ({ children, baseColor = "gray", ...props }: KeyProps) => {
  // Chakraのカラーパレットから色コードを取得
  const [bgBase, shadowDark, shadowLight, hoverBg, fontColor] = useToken(
    "colors",
    [
      `${baseColor}.100`, // 背景色
      `${baseColor}.300`, // 影(暗め)
      `${baseColor}.50`, // 影(明るめ)
      `${baseColor}.200`, // ホバー時背景色
      `${baseColor}.800`, // 文字色
    ]
  );

  return (
    <Box
      as="kbd"
      display="inline-block"
      px="4px"
      py="0"
      mx="1px"
      minW="1.6em"
      borderRadius="sm"
      fontSize="md"
      fontFamily="monospace"
      bg={bgBase}
      color={fontColor}
      boxShadow={`
         1px 1px 2px ${shadowDark},
         -1px -1px 2px ${shadowLight},
        1px 1px 2px rgba(0,0,0,0.1)
      `}
      textAlign="center"
      transition="all 0.2s ease"
      _hover={{
        boxShadow: `
           1px 1px 2px ${shadowDark},
           -1px -1px 2px ${shadowLight},
          2px 2px 5px rgba(0,0,0,0.15)
        `,
        bg: hoverBg,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
