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
      <Content isCustomHeader={false}>
        <Box mx={[0, 0, 8, 20]} my={[1, 1, 2, 4]}>
          <Box h="10px" />
          <ul className={styles.privacy}>
            <Text className={styles.subTitle}>1.転載について</Text>
            <Text>
              当サイトはリンクフリーです。リンクを貼る際の許可は必要ありません。引用についても、出典元のURLを貼っていただければ問題ありません。
              ただし、インラインフレームの使用や画像の直リンクはご遠慮ください。
            </Text>
            <Text className={styles.subTitle}>2.コメントについて</Text>
            <Text>
              次の各号に掲げる内容を含むコメントは、当サイト管理人の裁量によって承認せず、削除する事があります。
              <br />
              <br />
            </Text>
            <UnorderedList>
              <ListItem>特定の自然人または法人を誹謗し、中傷するもの</ListItem>
              <ListItem>極度にわいせつな内容を含むもの</ListItem>
              <ListItem>
                禁制品の取引に関するものや、他者を害する行為の依頼など、法律によって禁止されている物品、行為の依頼や斡旋などに関するもの
              </ListItem>
              <ListItem>
                その他、公序良俗に反し、または管理人によって承認すべきでないと認められるもの
              </ListItem>
            </UnorderedList>
            <Text className={styles.subTitle}>
              3.当サイトの情報の正確性について
            </Text>
            <Text>
              当サイトのコンテンツや情報において、可能な限り正確な情報を掲載するよう努めています。
              しかし、誤情報が入り込んだり、情報が古くなったりすることもあります。必ずしも正確性を保証するものではありません。また合法性や安全性なども保証しません。
            </Text>
            <Text className={styles.subTitle}>4.損害等の責任について</Text>
            <Text>
              当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますので、ご了承ください。
              <br />
              <br />
              また当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任も負いません。
              <br />
              <br />
              当サイトの保守、火災、停電、その他の自然災害、ウィルスや第三者の妨害等行為による不可抗力によって、
              当サイトによるサービスが停止したことに起因して利用者に生じた損害についても、何ら責任を負うものではありません。
              <br />
              <br />
              当サイトを利用する場合は、自己責任で行う必要があります。
              <br />
            </Text>
            <Text className={styles.subTitle}>
              5.当サイトで掲載している画像の著作権や肖像権等について
            </Text>
            <Text>
              当サイトで掲載している文章や画像などについて、無断転載を禁止します。
              <br />
              <br />
              当サイトで掲載している画像の著作権や肖像権等は、各権利所有者に帰属します。
              万が一問題がある場合は、お問い合わせよりご連絡いただけますよう宜しくお願い致します。
              <br />
              <br />
            </Text>
            <Text>2022年4月22日 策定</Text>
            <Box h="6px"></Box>
            <Text>2022年5月27日 改訂</Text>
            <Box h="40px"></Box>
          </ul>
        </Box>
      </Content>
    </>
  );
}
