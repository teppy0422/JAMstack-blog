import NextAuth from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
import NextLink from "next/link";

import {
  Flex,
  Center,
  Text,
  VStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  Link,
  Button,
  Box,
} from "@chakra-ui/react";
import { PhoneIcon, AddIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import styles from "../styles/home.module.scss";
import Image from "next/image";
import React from "react";

import LoginBtn from "./loginBtn";

import { env } from "process";

export default function Header() {
  const { data: session } = useSession();

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
              <LoginBtn />

              <Box style={{ display: "none" }} id="none">
                <NextLink
                  href="https://github.com/teppy0422/JAMstack-blog"
                  passHref
                >
                  <Link
                    _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
                  >
                    <FontAwesomeIcon
                      color={color}
                      icon={faGithub}
                      className={styles.githubIcon}
                    />
                  </Link>
                </NextLink>
              </Box>
            </Center>
            <Center
              flex="1"
              style={{ gap: "4px" }}
              className={styles.logoAndText}
            >
              <svg
                viewBox="-15,80,60,60"
                className={styles.logo}
                style={{ backgroundColor: "#111;" }}
              >
                <path d="M10.729923,127.85275 c -2.8633203,-0.64195 -5.7809833,-2.2546 -7.6029793,-4.20232 -2.71948803,-2.90714 -4.03868803,-5.85986 -4.03868803,-9.03966 v -1.63491 l 1.365844,-0.16177 c 1.99806403,-0.23664 3.63172803,-1.15354 4.79294703,-2.69006 1.416664,-1.87453 2.557995,-4.29711 2.680002,-5.68854 0.05742,-0.65485 0.116243,-1.27993 0.13072,-1.38907 0.01448,-0.10914 0.540492,-0.19843 1.168924,-0.19843 2.0168213,0 3.8262033,-0.71348 5.0793843,-2.00291 0.626531,-0.64465 1.22157,-1.17209 1.322309,-1.17209 0.100739,0 0.768508,0.52627 1.48393,1.1695 1.613961,1.45109 3.292081,2.28077 5.054902,2.4992 l 1.353886,0.16775 0.300673,1.45521 c 0.817552,3.95682 4.011102,7.4686 7.34721,8.07933 0.978188,0.17908 0.992161,0.19896 0.990332,1.40897 -0.0026,1.69332 -0.907536,5.31392 -1.745599,6.9837 -1.648468,3.28448 -3.341526,4.48453 -8.306713,5.88785 -3.154913,0.89168 -8.623521,1.1456 -11.377084,0.52825 z M -2.8744683,110.96968 c -2.068338,-2.71173 -2.065755,-6.83028 0.0065,-10.4246 0.821618,-1.425067 1.559682,-1.930427 2.81935,-1.930427 2.610953,0 5.486838,2.949917 5.486838,5.628087 0,1.9649 -3.025031,6.13924 -5.14763,7.10339 -1.620182,0.73594 -2.386117,0.64484 -3.165094,-0.37645 z m 33.5631303,-0.0131 c -1.95025,-0.91771 -3.270954,-2.20007 -4.12491,-4.00514 -0.842209,-1.78025 -0.990759,-3.66914 -0.381249,-4.8478 0.530283,-1.02546 3.150325,-3.433097 3.956024,-3.635307 0.926526,-0.23255 2.531523,0.58905 3.245194,1.661197 0.757531,1.13805 1.73592,4.84205 1.762241,6.67153 0.01418,0.98634 -0.190682,1.99385 -0.621916,3.05839 -0.600583,1.48259 -0.704279,1.59213 -1.569122,1.65764 -0.553715,0.0419 -1.464892,-0.18342 -2.266262,-0.56051 z M 7.0882384,101.31584 c -1.035009,-0.32423 -4.73509,-3.432897 -5.081547,-4.269317 -0.287893,-0.69504 -0.252685,-0.95229 0.281998,-2.06042 0.89808,-1.86129 2.87534,-3.67722 4.548861,-4.17772 2.5152843,-0.75224 4.1391416,-0.77729 5.4643836,-0.0843 1.715155,0.89691 2.26628,1.78687 2.255764,3.64261 -0.01088,1.92048 -1.522894,5.19857 -2.872703,6.228117 -0.924537,0.70518 -3.4052206,1.09428 -4.5967566,0.72101 z m 12.7698106,-0.28025 c -1.575126,-0.96741 -2.987823,-2.800307 -3.188203,-4.136527 -0.246361,-1.64286 0.05068,-4.02385 0.626547,-5.02229 0.910045,-1.57784 3.253803,-2.12464 6.082514,-1.41907 2.154079,0.53729 5.342684,4.36722 5.342684,6.41726 0,0.91637 -2.284579,3.247797 -3.986139,4.067897 -1.536861,0.74071 -3.753749,0.78286 -4.877403,0.0927 z" />
              </svg>
              <NextLink href="/about">
                <Link
                  _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
                >
                  <Text className={styles.logoText}>Teppei</Text>
                </Link>
              </NextLink>
              <NextLink href="../">
                <Link
                  _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
                >
                  <Text className={styles.logoText}>Blog</Text>
                </Link>
              </NextLink>
            </Center>
            <Center w="64px">
              <IconButton
                className={styles.modeChange}
                _focus={{ _focus: "none" }} //周りの青いアウトラインが気になる場合に消す
                aria-label="DarkMode Switch"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} //自分の好みでSunアイコンはreact-iconsを使用しています
                colorScheme={colorMode === "light" ? "purple" : "yellow"}
                onClick={function (event) {
                  toggleColorMode();
                }}
              />
            </Center>
          </Flex>
        </VStack>
      </header>
    </>
  );
}
