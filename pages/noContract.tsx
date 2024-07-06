import NextLink from "next/link";
import { useState, useEffect } from "react";
import Content from "../components/content";
import {
  Container,
  Tag,
  Flex,
  Image,
  Box,
  Text,
  Spacer,
  Center,
  useColorMode,
  useColorModeValue,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";
import styles from "../styles/home.module.scss";
import Moment from "react-moment";

export default function Home({ blog, category, tag, blog2 }) {
  const [showBlogs, setShowBlogs] = useState(blog);

  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "pink.100");
  const color = useColorModeValue("#111111", "#111111");
  const myClass = useColorModeValue(styles.myLight, styles.myDark);
  return (
    <>
      <Content isCustomHeader={true}>
        <Box mx={[0, 0, 8, 20]} my={[1, 1, 2, 4]}>
          <Box h="10px" />
          <ul className={styles.privacy}>
            <Text className={styles.subTitle}>契約していません</Text>
            <Text>契約外によりこのページにはアクセス出来ません</Text>
          </ul>
        </Box>
      </Content>
    </>
  );
}
