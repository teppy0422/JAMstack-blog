import { HStack, Box, Center } from "@chakra-ui/react";

const activeColors = ["#FF5F57", "#FFBD2E", "#28C840"];
const inactiveColor = "gray.600";

type MacCloseButtonProps = {
  onClickHandlers?: Array<(() => void) | undefined>;
  title?: string;
};

export const MacCloseButton = ({
  onClickHandlers = [],
  title,
}: MacCloseButtonProps) => {
  return (
    <Box bg="#3c3b39" w="100%" h="30px">
      <Center fontSize="11px" fontWeight={600} color="#ccc" h="100%">
        {title}
      </Center>
      <HStack position="absolute" top="10px" left="10px">
        {[0, 1, 2].map((i) => {
          const handler = onClickHandlers[i];
          const isActive = typeof handler === "function";
          return (
            <Box
              key={i}
              bg={isActive ? activeColors[i] : inactiveColor}
              borderRadius="full"
              h="11px"
              w="11px"
              mx={i > 0 ? "1px" : 0}
              {...(isActive
                ? {
                    cursor: "pointer",
                    onClick: handler,
                    _hover: { opacity: 0.7 },
                  }
                : {
                    cursor: "default",
                  })}
            />
          );
        })}
      </HStack>
    </Box>
  );
};

export default MacCloseButton;
