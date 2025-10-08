import React from "react";
import { Box, Flex, Icon, Text, CloseButton } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import MacCloseButton from "./MacCloseButton";

type CustomToastProps = {
  onClose: () => void;
  title?: string;
  description?: React.ReactNode;
};

export const CustomToast = ({
  onClose,
  title,
  description,
}: CustomToastProps) => {
  return (
    <Box
      m={0}
      borderRadius="lg"
      boxShadow="lg"
      border="0.1px solid"
      borderColor="#333"
      outline="1px solid"
      outlineColor="#ccc"
      bgGradient="linear(to-r, custom.system.400, custom.system.300)"
      color="white"
      overflow="hidden"
    >
      <Flex align="center" mb={1}>
        <MacCloseButton onClickHandlers={[onClose]} title={title} />
      </Flex>

      <Flex align="center" px={4} py={2}>
        <Box flex="1" fontSize="13px">
          {description}
        </Box>
      </Flex>
    </Box>
  );
};

export default CustomToast;

