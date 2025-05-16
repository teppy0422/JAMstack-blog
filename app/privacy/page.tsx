"use client";

import NextLink from "next/link";
import { useState, useEffect } from "react";
import Content from "../../components/content";
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
import styles from "@/styles/home.module.scss";
import Moment from "react-moment";
import { useLanguage } from "../../context/LanguageContext";
import getMessage from "../../components/getMessage";

export default function Home() {
  const { language, setLanguage } = useLanguage();
  //右リストの読み込みをlanguage取得後にする
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);
  useEffect(() => {
    if (language) {
      setIsLanguageLoaded(true);
    }
  }, [language]);
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "pink.100");
  const color = useColorModeValue("#111111", "#111111");
  const myClass = useColorModeValue(styles.myLight, styles.myDark);
  //右リストの読み込みをlanguage取得後にする
  if (!isLanguageLoaded) {
    return <div>Loading...</div>; // 言語がロードされるまでのプレースホルダー
  }
  return (
    <>
      <Content isCustomHeader={true}>
        <Box mx={[0, 0, 8, 20]} my={[1, 1, 2, 4]}>
          <Box h="10px" />
          <ul className={styles.privacy}>
            <Text className={styles.subTitle}>
              {"1." +
                getMessage({
                  ja: "転載について",
                  us: "About reprinting",
                  cn: "关于重印",
                  language,
                })}
            </Text>
            <Text>
              {getMessage({
                ja: "当サイトはリンクフリーです。リンクを貼る際の許可は必要ありません。引用についても、出典元のURLを貼っていただければ問題ありません。ただし、インラインフレームの使用や画像の直リンクはご遠慮ください。",
                us: "This site is link-free. You do not need permission to link to this site. Quotations are also acceptable as long as the URL of the source is attached. However, please refrain from using inline frames or direct links to images.",
                cn: "本网站无链接。链接本网站无需获得许可。只要附上资料来源的 URL, 也可以引用资料。但是, 请勿使用内联框架和直接链接图片。",
                language,
              })}
            </Text>
            <Text className={styles.subTitle}>
              {"2." +
                getMessage({
                  ja: "コメントについて",
                  us: "About Comments",
                  cn: "关于评论",
                  language,
                })}
            </Text>
            <Text>
              {getMessage({
                ja: "次の各号に掲げる内容を含むコメントは、当サイト管理人の裁量によって承認せず、削除する事があります。",
                us: "Comments that include any of the following items may not be approved and may be deleted at the discretion of the administrator of this site.",
                cn: "包含以下内容的评论可能不会被批准，网站管理员可能会酌情删除这些评论。",
                language,
              })}
              <br />
              <br />
            </Text>
            <UnorderedList>
              <ListItem>
                {getMessage({
                  ja: "特定の自然人または法人を誹謗し、中傷するもの",
                  us: "Any material that defames or slanders a specific natural or legal person",
                  cn: "诽谤或中伤特定自然人或法人的行为。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "わいせつな内容を含むもの",
                  us: "Material containing obscene content",
                  cn: "含有淫秽内容的材料。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "禁制品の取引に関するものや、他者を害する行為の依頼など、法律によって禁止されている物品、行為の依頼や斡旋などに関するもの",
                  us: "Items related to transactions of prohibited goods, or requests for or facilitation of activities that are prohibited by law, such as requests to engage in activities that are harmful to others.",
                  cn: "与违禁品交易有关的项目，或对法律禁止的项目或行为提出请求或进行调解，例如对伤害他人的行为提出请求。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "その他、公序良俗に反し、または管理人によって承認すべきでないと認められるもの",
                  us: "Other items that are deemed offensive to public order and morals or that should not be approved by the administrator.",
                  cn: "其他被认为有伤公序良俗或管理员不应批准的物品。",
                  language,
                })}
              </ListItem>
            </UnorderedList>
            <Text className={styles.subTitle}>
              {"3." +
                getMessage({
                  ja: "当サイトの情報の正確性について",
                  us: "Accuracy of Information on this Site",
                  cn: "本网站信息的准确性",
                  language,
                })}
            </Text>
            <Text>
              {getMessage({
                ja: "当サイトのコンテンツや情報において、可能な限り正確な情報を掲載するよう努めています。しかし、誤情報が入り込んだり、情報が古くなったりすることもあります。必ずしも正確性を保証するものではありません。また合法性や安全性なども保証しません。",
                us: "Every effort is made to include as much accurate information as possible in the content and information on this site. However, misinformation may be introduced or information may be outdated. We do not necessarily guarantee accuracy. We also do not guarantee legality or safety.",
                cn: "本网站的内容和信息力求准确无误。但是，可能会出现信息错误或信息过时的情况。我们不保证信息的准确性。我们也不保证合法性或安全性。",
                language,
              })}
            </Text>
            <Text className={styles.subTitle}>
              {"4." +
                getMessage({
                  ja: "損害等の責任について",
                  us: "Liability for Damages, etc.",
                  cn: "损害赔偿责任等",
                  language,
                })}
            </Text>
            <Text>
              {getMessage({
                ja: "当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますので、ご了承ください。",
                us: "Please understand that we are not responsible for any damages or other losses caused by the content of this website.",
                cn: "请注意，对于本网站内容造成的任何损害或其他损失，公司概不负责。",
                language,
              })}
              <br />
              <br />
              {getMessage({
                ja: "また当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任も負いません。",
                us: "In the event that you are transferred from this site to another site via a link, banner, or other means, we assume no responsibility for the information, services, or other content provided on the new site.",
                cn: "如果您通过本网站的链接、横幅或其他方式被转到其他网站，本公司对这些网站提供的信息、服务或其他内容不承担任何责任。",
                language,
              })}
              <br />
              <br />
              {getMessage({
                ja: "当サイトの保守、火災、停電、その他の自然災害、ウィルスや第三者の妨害等行為による不可抗力によって、当サイトによるサービスが停止したことに起因して利用者に生じた損害についても、何ら責任を負うものではありません。",
                us: "The Company shall not be liable for any damages incurred by users as a result of the suspension of service on this site due to force majeure caused by maintenance of this site, fire, power outages, other natural disasters, viruses, or interference by a third party.",
                cn: "对于因不可抗力（如网站维护、火灾、停电、其他自然灾害、病毒或第三方干扰行为）导致网站暂停服务而给用户造成的任何损失，本网站不承担任何责任。",
                language,
              })}
              <br />
              <br />
              {getMessage({
                ja: "当サイトを利用する場合は、自己責任で行う必要があります。",
                us: "If you use this site, you do so at your own risk.",
                cn: "使用本网站，风险自负。",
                language,
              })}
              <br />
            </Text>
            <Text className={styles.subTitle}>
              {"5." +
                getMessage({
                  ja: "当サイトで掲載している画像の著作権や肖像権等について",
                  us: "Copyrights and portrait rights for images posted on this site",
                  cn: "本网站图片的版权和肖像权。",
                  language,
                })}
            </Text>
            <Text>
              {getMessage({
                ja: "当サイトで掲載している文章や画像などについて、無断転載を禁止します。",
                us: "Unauthorized reproduction of any text, images, etc. posted on this site is prohibited.",
                cn: "禁止未经授权复制本网站上的任何文字或图片。",
                language,
              })}
              <br />
              <br />
              {getMessage({
                ja: "当サイトで掲載している画像の著作権や肖像権等は、各権利所有者に帰属します。万が一問題がある場合は、お問い合わせよりご連絡いただけますよう宜しくお願い致します。",
                us: "Copyrights and portrait rights for the images on this site belong to their respective owners. If you have any problems, please contact us from the Contact Us page.",
                cn: '本网站图片的版权和肖像权归相关权利人所有。如有任何问题，请通过 "联系我们" 栏目与我们联系。',
                language,
              })}
              <br />
              <br />
            </Text>
            <Text>
              {getMessage({
                ja: "2022年4月22日 策定",
                us: "April 22, 2022 Formulation",
                cn: "制剂： 2022 年 4 月 22 日",
                language,
              })}
            </Text>
            <Box h="6px"></Box>
            <Text>
              {getMessage({
                ja: "2025年1月9日 改訂",
                us: "January 9, 2025 Revised",
                cn: "2025 年 1 月 9 日修订。",
                language,
              })}
            </Text>
            <Box h="40px"></Box>
          </ul>
        </Box>
      </Content>
    </>
  );
}
