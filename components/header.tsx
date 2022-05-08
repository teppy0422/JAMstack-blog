import {
  Flex,
  Center,
  Text,
  VStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { PhoneIcon, AddIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "../styles/home.module.scss";
import Image from "next/image";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  const bg = useColorModeValue("red.500", "red.200");
  const color = useColorModeValue("tomato", "pink");
  const myClass = useColorModeValue(styles.myLight, styles.myDark);
  return (
    <>
      <header id="navTop">
        <VStack>
          <Flex className={`${myClass} ${styles.headerNav}`}>
            <Center w="64px">
              <Link
                _focus={{ _focus: "none" }}
                href="https://github.com/teppy0422/JAMstack-blog"
                isExternal
              >
                <FontAwesomeIcon
                  color={color}
                  icon={faGithub}
                  className={styles.githubIcon}
                />
              </Link>
            </Center>
            <Center
              flex="1"
              style={{ gap: "4px" }}
              className={styles.logoAndText}
            >
              <Image
                className={styles.logo}
                src="/images/hippo_001_footprint.svg"
                alt="logo"
                width="30"
                height="30"
              />
              <Link href="/">
                <Text className={styles.logoText}>TeppeiKataoka</Text>
              </Link>
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
