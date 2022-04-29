import {
  Flex,
  Center,
  Text,
  VStack,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { PhoneIcon, AddIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import styles from "../styles/home.module.scss";
import Image from "next/image";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  const bg = useColorModeValue("red.500", "red.200");
  const color = useColorModeValue("white", "gray.800");
  const myClass = useColorModeValue(styles.myLight, styles.myDark);
  return (
    <>
      <header>
        <VStack>
          <Flex className={`${myClass} ${styles.headerNav}`}>
            <Center w="100px">
              <Text bg={bg} color={color} style={{ padding: "0 10px" }}>
                left
              </Text>
            </Center>
            <Center flex="1" style={{ gap: "4px" }}>
              <Image
                className={styles.logo}
                src="/images/hippo_001_footstump.webp"
                alt="logo"
                width="40"
                height="30"
              />
              <Text>horizontal_area</Text>
            </Center>
            <Center w="100px">
              <IconButton
                _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
                aria-label="DarkMode Switch"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} //自分の好みでSunアイコンはreact-iconsを使用しています
                colorScheme={colorMode === "light" ? "purple" : "yellow"}
                onClick={toggleColorMode}
              />
            </Center>
          </Flex>
        </VStack>
      </header>
    </>
  );
}
