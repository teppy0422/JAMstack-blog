import { HStack, Box } from "@chakra-ui/react";

type MacCloseButtonProps = {
  onClickHandlers?: Array<(() => void) | undefined>;
};

const activeColors = ["#FF5F57", "#FFBD2E", "#28C840"];
const inactiveColor = "gray.600";

export const MacCloseButton = ({
  onClickHandlers = [],
}: MacCloseButtonProps) => {
  return (
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
  );
};

export default MacCloseButton;
