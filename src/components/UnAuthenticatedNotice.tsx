import { Box, Text, Image, VStack } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const float = keyframes`
0% { transform: translateY(0); }
50% { transform: translateY(-3px); }
100% { transform: translateY(0); }
`;

const slideY = keyframes`
0% {
  transform: translateX(80px) translateY(20px) scale(1);
  opacity: 0;
  }
  33% {
    transform: translateX(65px) translateY(10px) scale(1.2);
    opacity: 1;
    }
    66% {
      transform: translateX(20px) translateY(-5px) scale(2);
      opacity: 0.8;
      }
      100% {
        transform: translateX(0px) translateY(-25px) scale(2.5);
        opacity: 0;
        }
        `;

const growIn = keyframes`
        0% { height: 0; opacity: 0; }
        100% { height: 100px; opacity: 1; }
        `;
type UnAuthenticatedNoticeProps = {
  currentUserId: string | null;
  currentUserName?: string | null;
  colorMode: "light" | "dark";
};
const UnAuthenticatedNotice = ({
  currentUserId,
  currentUserName,
  colorMode,
}: UnAuthenticatedNoticeProps) => {
  let message = "";

  if (!currentUserId) {
    message =
      "閲覧するにはログインが必要です\n右上のアイコンからログインしてください";
  } else if (!currentUserName) {
    message =
      "このユーザーは管理者の認証を受けていません\n管理者にお問い合わせください";
  }

  if (!message) return null;

  return (
    <Box
    // bg={
    //   colorMode === "light"
    //     ? "custom.theme.light.500"
    //     : "custom.theme.dark.500"
    // }
    >
      <Box
        w="100%"
        h="350px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4} position="relative">
          {/* 吹き出し */}
          <Box
            bg="gray.100"
            px={3}
            py={4}
            borderRadius="full"
            boxShadow="md"
            position="relative"
            zIndex={1}
            textAlign="center"
            animation={`${float} 2s ease-in-out infinite`}
          >
            <Text fontSize="13px" color="gray.800" whiteSpace="pre-line">
              {message}
            </Text>
          </Box>

          <Box
            position="relative"
            h="40px"
            w="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                position="absolute"
                zIndex={0}
                bg="gray.100"
                w="10px"
                h="10px"
                borderRadius="full"
                boxShadow="md"
                animation={`${float} 1s ease-in-out infinite, ${slideY} 3s ease-in-out infinite`}
                sx={{ animationDelay: `${i}s` }}
              ></Box>
            ))}
          </Box>

          <Box
            position="absolute"
            right="0"
            bottom="-100px"
            h="100px"
            overflow="visible"
            animation={`${growIn} 1s ease-out`}
            sx={{ animationDelay: "0.2s" }}
            display="flex"
            alignItems="flex-end"
            justifyContent="flex-end"
          >
            <Image
              src="/images/illust/hippo/hippo_000_paper.svg"
              alt="キャラクター"
              boxSize="100px"
              objectFit="contain"
              filter="brightness(1.05)"
              borderRadius="4px"
            />
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default UnAuthenticatedNotice;
