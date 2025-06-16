"use client";

import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { TbBell } from "react-icons/tb";
import { CustomAvatar } from "@/components/ui/CustomAvatar";
import YoutubeLike from "/public/images/etc/youtubeLike.svg";

type TopNavbarProps = {
  currentUserPictureUrl?: string;
};

const TopNavbar: React.FC<TopNavbarProps> = ({ currentUserPictureUrl }) => {
  const { colorMode } = useColorMode();

  return (
    <HStack
      px={2}
      py={1}
      borderColor="gray.300"
      spacing={0.5}
      bg="custom.system.700"
      mb="10px"
    >
      {/* 左：ロゴ */}
      <Box
        justifyContent="center"
        display="flex"
        alignItems="center"
        color={colorMode === "light" ? "#D13030" : "#F89173"}
        w="36px"
        minW="36px"
        mr="0"
        ml="0"
        bottom="4px"
      >
        <YoutubeLike />
      </Box>

      <Box fontWeight="900" fontSize="lg" letterSpacing="-1px">
        Premium
      </Box>

      <Spacer />

      <InputGroup maxW="600px" flex="3" display={{ base: "none", sm: "block" }}>
        <Input
          placeholder="検索"
          color="#ddd"
          bg="custom.system.700"
          border="0.5px solid"
          borderColor="custom.system.100"
          borderRadius="full"
          h="28px"
          fontSize="13px"
          focusBorderColor="custom.system.200"
        />
        <InputRightElement
          borderRightRadius="full"
          border="0.5px solid"
          borderColor="custom.system.100"
          bg="custom.system.500"
          w={{ base: "2rem", md: "3rem" }}
          h="28px"
        >
          <IconButton
            aria-label="Search"
            icon={<SearchIcon />}
            color="#ddd"
            variant="ghost"
            mx="20px"
            w="100px"
            _hover={{ bg: "none" }}
          />
        </InputRightElement>
      </InputGroup>

      <Spacer />

      <HStack spacing={3}>
        <IconButton
          aria-label="Notifications"
          icon={<TbBell />}
          fontSize="24px"
          bg="transparent"
          borderRadius="full"
          color="#ccc"
          _hover={{ bg: "custom.system.500" }}
        />
        <CustomAvatar src={currentUserPictureUrl ?? undefined} boxSize="34px" />
      </HStack>
    </HStack>
  );
};

export default TopNavbar;
