import { HStack, Box, Center, Icon } from "@chakra-ui/react";
import { is } from "cheerio/dist/commonjs/api/traversing";
import { GrFormClose, GrFormSubtract } from "react-icons/gr";
import { RiExpandLeftRightFill } from "react-icons/ri";

const icons = [GrFormClose, GrFormSubtract, RiExpandLeftRightFill];
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
    <Box
      bg="custom.system.600"
      w="100%"
      h="30px"
      borderBottom="0.5px solid"
      borderBottomColor="custom.system.900"
      position="relative"
    >
      <Center fontSize="11px" fontWeight={600} color="#ccc" h="100%">
        {title}
      </Center>

      <HStack position="absolute" top="10px" left="10px" role="group">
        {icons.map((IconComponent, i) => {
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
              position="relative"
              onClick={isActive ? handler : undefined}
              _hover={{
                "& > .icon": {
                  opacity: 1,
                },
              }}
            >
              <Box
                className="icon"
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                opacity={0}
                transition="opacity 0.1s"
                pointerEvents="none"
                transform={i === 2 ? "rotate(45deg)" : undefined}
                _groupHover={{ opacity: 1 }} // ← ここがポイント
              >
                <Icon
                  opacity={isActive ? 1 : 0}
                  as={IconComponent}
                  color="custom.system.900"
                  boxSize="12px"
                />
              </Box>
            </Box>
          );
        })}
      </HStack>
    </Box>
  );
};

export default MacCloseButton;
