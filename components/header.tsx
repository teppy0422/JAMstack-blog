import {
  Flex,
  Center,
  Text,
  VStack,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { PhoneIcon, AddIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";

import styles from "../styles/home.module.scss";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <div>
      <header>
        <VStack>
          <Flex className={styles.TopHeader}>
            <Center w="100px">
              <Text>TeppyBlog</Text>
            </Center>
            <Center flex="1">
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
    </div>
  );
}
