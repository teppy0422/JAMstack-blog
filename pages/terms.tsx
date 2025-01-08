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
  OrderedList,
} from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";
import styles from "../styles/home.module.scss";
import Moment from "react-moment";
import { useLanguage } from "../context/LanguageContext";
import getMessage from "../components/getMessage";

export default function Home({ blog, category, tag, blog2 }) {
  const [showBlogs, setShowBlogs] = useState(blog);

  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.100", "pink.100");
  const color = useColorModeValue("#111111", "#111111");
  const myClass = useColorModeValue(styles.myLight, styles.myDark);
  const { language, setLanguage } = useLanguage();

  return (
    <>
      <Content isCustomHeader={true}>
        <Box mx={[0, 0, 8, 20]} my={[1, 1, 2, 4]}>
          <Box h="10px" />
          <ul className={styles.privacy} style={{ lineHeight: "1.5rem" }}>
            <Text className={styles.subTitle}>
              {getMessage({
                ja: "利用規約",
                us: "Terms of Use",
                cn: "条款和条件",
                language,
              })}
            </Text>
            <Text>
              {getMessage({
                ja: "この利用規約（以下、「本規約」といいます。）は、STUDIO+（以下、「当社」といいます。）がこのウェブサイト上で提供するサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。",
                us: "These Terms of Use (hereinafter referred to as 'Terms') set forth the conditions for using the services (hereinafter referred to as 'Services') provided by STUDIO+ (hereinafter referred to as 'Company') on this website. Registered users (hereinafter referred to as 'Users') shall use the Services in accordance with these Terms.",
                cn: "本使用条款（以下简称“条款”）规定了STUDIO+（以下简称“公司”）在本网站上提供的服务（以下简称“服务”）的使用条件。注册用户（以下简称“用户”）应根据本条款使用服务。",
                language,
              })}
            </Text>
            <Text className={styles.subTitle}>
              {getMessage({
                ja: "第1条（適用）",
                us: "Article 1 (Application)",
                cn: "第 1 条（适用)",
                language,
              })}
            </Text>
            <OrderedList>
              <ListItem>
                {getMessage({
                  ja: "本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。",
                  us: "These Terms of Use shall apply to all relationships related to the use of the Service between the user and the Company.",
                  cn: "本条款和条件适用于用户与公司之间有关使用服务的所有关系。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "当社は本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下、「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。",
                  us: 'In addition to the Terms of Use, the Company may stipulate various rules and regulations concerning the use of the Service (hereinafter referred to as "Individual Regulations"). These individual provisions, regardless of their name, shall constitute a part of the Terms of Service. Regardless of the name by which these Individual Regulations are called, they shall constitute a part of these Terms of Use.',
                  cn: '除本条款外，"公司 "还可能制定使用规则等与本服务相关的各种规定（以下简称 "个别规定"）。这些个别条款无论名称如何，均构成本条款的一部分。无论其名称如何，这些个别条款均构成本条款的一部分。',
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "本規約の規定が前条の個別規定の規定と矛盾する場合には、個別規定において特段の定めなき限り、個別規定の規定が優先されるものとします。",
                  us: "In the event of any inconsistency between the provisions of these Terms and Conditions and the individual provisions of the preceding Article, the provisions of the individual provisions shall take precedence unless otherwise specified in the individual provisions.",
                  cn: "如果本条款和条件的规定与前一条中的个别规定相冲突，则以个别规定为准，除非个别规定中另有说明。",
                  language,
                })}
              </ListItem>
            </OrderedList>
            <Text className={styles.subTitle}>
              {getMessage({
                ja: "第2条（利用登録）",
                us: "Article 2 (Registration for Use)",
                cn: "第 2 条（使用登记）",
                language,
              })}
            </Text>
            <OrderedList>
              <ListItem>
                {getMessage({
                  ja: "本サービスにおいては、登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。",
                  us: "The registration for this service is completed when a prospective registrant agrees to the Terms of Use and applies for registration for use of the service through a method determined by the Company, and when the Company approves the application.",
                  cn: "当潜在注册人同意本条款和条件，并按照公司规定的方式申请注册使用且公司批准该申请后，服务使用注册即告完成。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。",
                  us: "The Company may not approve an application for registration of use if it determines that the applicant has any of the following reasons, and the Company shall not be obligated to disclose any reasons for such denial.",
                  cn: "如果公司认为使用注册申请人有以下任何原因，则可能不批准使用注册申请，且无义务披露任何原因。",
                  language,
                })}
              </ListItem>
              <Box h={5} />
              <UnorderedList>
                <ListItem>
                  {getMessage({
                    ja: "利用登録の申請に際して虚偽の事項を届け出た場合",
                    us: "If false information is reported when applying for user registration",
                    cn: "如果在申请用户注册时报告了虚假信息。",
                    language,
                  })}
                </ListItem>
                <ListItem>
                  {getMessage({
                    ja: "本規約に違反したことがある者からの申請である場合",
                    us: "If the application is from a person who has violated these Terms and Conditions",
                    cn: "如果申请者曾违反本条款和条件",
                    language,
                  })}
                </ListItem>
                <ListItem>
                  {getMessage({
                    ja: "その他、当社が利用登録を相当でないと判断した場合",
                    us: "Other cases in which the Company deems the registration of use to be inappropriate.",
                    cn: "公司认为使用登记不适当的其他情况。",
                    language,
                  })}
                </ListItem>
              </UnorderedList>
            </OrderedList>
            <Text className={styles.subTitle}>
              {getMessage({
                ja: "第3条（ユーザーIDおよびパスワードの管理）",
                us: "Article 3 (Management of User ID and Password)",
                cn: "第 3 条（用户 ID 和密码的管理）",
                language,
              })}
            </Text>
            <OrderedList>
              <ListItem>
                {getMessage({
                  ja: "ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。",
                  us: "The User shall properly manage his/her user ID and password for the Service at his/her own responsibility.",
                  cn: "用户应妥善管理其用户 ID 和密码，风险自负。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。当社は、ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。",
                  us: "Under no circumstances may a user transfer or lend his/her user ID and password to a third party, or share them with a third party. When a user logs in with a combination of user ID and password that matches the registered information, we will consider the use of the service to be by the user who has registered that user ID.",
                  cn: "在任何情况下，用户均不得将用户 ID 和密码转让或出借给第三方或与第三方共享。如果用户 ID 和密码的组合与注册信息相符且用户登录，我们则认为这是由注册该用户 ID 的用户本人使用。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "ユーザーID及びパスワードが第三者によって使用されたことによって生じた損害は、当社に故意又は重大な過失がある場合を除き、当社は一切の責任を負わないものとします。",
                  us: "The Company shall not be liable for any damage caused by the use of user IDs and passwords by third parties, except in the case of willful misconduct or gross negligence on the part of the Company.",
                  cn: "对于因第三方使用用户 ID 和密码而造成的任何损失，公司概不负责，除非公司故意或严重疏忽。",
                  language,
                })}
              </ListItem>
            </OrderedList>
            {/* <Text className={styles.subTitle}>
              第4条（利用料金および支払方法）
            </Text>

            <OrderedList>
              <ListItem>
                ユーザーは、本サービスの有料部分の対価として、当社が別途定め、本ウェブサイトに表示する利用料金を、当社が指定する方法により支払うものとします。
              </ListItem>
              <ListItem>
                ユーザーが利用料金の支払を遅滞した場合には、ユーザーは年14．6％の割合による遅延損害金を支払うものとします。
              </ListItem>
              <ListItem>
                ユーザーID及びパスワードが第三者によって使用されたことによって生じた損害は、当社に故意又は重大な過失がある場合を除き、当社は一切の責任を負わないものとします。{" "}
              </ListItem>
            </OrderedList> */}
            <Text className={styles.subTitle}>
              {getMessage({
                ja: "第4条（禁止事項）",
                us: "Article 4 (Prohibited Matters)",
                cn: "第 4 条（禁止事项）。",
                language,
              })}
            </Text>
            <Text>
              {getMessage({
                ja: "ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。",
                us: "In using the Service, the User shall not engage in any of the following acts",
                cn: "在使用服务时，用户不得有以下行为",
                language,
              })}
            </Text>
            <Text h={5} />
            <OrderedList>
              <ListItem>
                {getMessage({
                  ja: "法令または公序良俗に違反する行為",
                  us: "Acts that violate laws and regulations or public order and morals",
                  cn: "违反法律或公共秩序和道德的罪行。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "犯罪行為に関連する行為",
                  us: "Conduct related to criminal activity",
                  cn: "与刑事犯罪有关的行为。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "本サービスの内容等、本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為",
                  us: "Acts that infringe on copyrights, trademarks, or other intellectual property rights contained in this service, including the contents of this service.",
                  cn: '侵犯 "服务"（包括 "服务 "内容）中包含的版权、商标和其他知识产权的行为。',
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為",
                  us: "Any action that destroys or interferes with the functionality of the servers or networks of the Company, other users, or other third parties.",
                  cn: "破坏或干扰公司、其他用户或其他第三方的服务器或网络功能的行为。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "本サービスによって得られた情報を商業的に利用する行為",
                  us: "Commercial use of information obtained through this service",
                  cn: "将通过本服务获得的信息用于商业用途。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "当社のサービスの運営を妨害するおそれのある行為",
                  us: "Acts that may interfere with the operation of our services",
                  cn: "可能干扰我们服务运营的行为。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "不正アクセスをし、またはこれを試みる行為",
                  us: "Unauthorized access or attempts to do so",
                  cn: "未经授权的访问或尝试进行此类访问。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "他のユーザーに関する個人情報等を収集または蓄積する行為",
                  us: "Collecting or storing personal information about other users",
                  cn: "收集或存储其他用户的个人信息。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "不正な目的を持って本サービスを利用する行為",
                  us: "Using the service for unauthorized purposes",
                  cn: "出于未经授权的目的使用服务。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為",
                  us: "Acts that cause disadvantage, damage, or discomfort to other users or third parties",
                  cn: "对其他用户或第三方造成不利、损害或不适的行为。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "他のユーザーに成りすます行為",
                  us: "Impersonating other users",
                  cn: "冒充其他用户。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "当社が許諾しない本サービス上での宣伝、広告、勧誘、または営業行為",
                  us: "Advertising, soliciting, or business activities not authorized by the Company on this service",
                  cn: "在本服务上进行未经公司授权的广告、招揽或商业活动。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "面識のない異性との出会いを目的とした行為",
                  us: "Acts aimed at meeting unfamiliar members of the opposite sex",
                  cn: "以结识不熟悉的异性为目的的行为。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為",
                  us: "Acts of providing benefits directly or indirectly to anti-social forces in connection with our services",
                  cn: "与我们的服务相关的，直接或间接向反社会势力提供利益的行为。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "その他、当社が不適切と判断する行為",
                  us: "Other acts that the Company deems inappropriate",
                  cn: "公司认为不当的其他行为。",
                  language,
                })}
              </ListItem>
            </OrderedList>

            <Text className={styles.subTitle}>
              {getMessage({
                ja: "第5条（本サービスの提供の停止等）",
                us: "Article 5 (Suspension of Service Provision, etc.)",
                cn: "第5条（服务提供的中止等）",
                language,
              })}
            </Text>
            <UnorderedList>
              <ListItem>
                {getMessage({
                  ja: "当社は，以下のいずれかの事由があると判断した場合，ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。",
                  us: "The Company may suspend or interrupt the provision of all or part of the Service without prior notice to the user if it determines that any of the following reasons exist.",
                  cn: "如果公司判断存在以下任何原因，可以在不事先通知用户的情况下中止或中断全部或部分服务的提供。",
                  language,
                })}
              </ListItem>
              <Text h={4} />
              <OrderedList>
                <ListItem>
                  {getMessage({
                    ja: "本サービスにかかるコンピュータシステムの保守点検または更新を行う場合",
                    us: "When performing maintenance inspections or updates on the computer system related to this service",
                    cn: "进行与本服务相关的计算机系统的维护检查或更新时",
                    language,
                  })}
                </ListItem>
                <ListItem>
                  {getMessage({
                    ja: "地震，落雷，火災，停電または天災などの不可抗力により，本サービスの提供が困難となった場合",
                    us: "When the provision of the service becomes difficult due to force majeure such as earthquakes, lightning, fire, power outages, or natural disasters",
                    cn: "由于地震、雷击、火灾、停电或自然灾害等不可抗力导致服务提供困难时",
                    language,
                  })}
                </ListItem>
                <ListItem>
                  {getMessage({
                    ja: "コンピュータまたは通信回線等が事故により停止した場合",
                    us: "When computers or communication lines are stopped due to an accident",
                    cn: "计算机或通信线路因事故而停止时",
                    language,
                  })}
                </ListItem>
                <ListItem>
                  {getMessage({
                    ja: "その他，当社が本サービスの提供が困難と判断した場合",
                    us: "Other cases where the Company determines that the provision of the service is difficult",
                    cn: "公司认为服务提供困难的其他情况",
                    language,
                  })}
                </ListItem>
              </OrderedList>
              <Text h={4} />

              <ListItem>
                {getMessage({
                  ja: "当社は，本サービスの提供の停止または中断により，ユーザーまたは第三者が被ったいかなる不利益または損害についても，一切の責任を負わないものとします。",
                  us: "The Company shall not be liable for any disadvantage or damage suffered by the user or third parties due to the suspension or interruption of the provision of the service.",
                  cn: "公司对因服务提供的中止或中断而导致用户或第三方遭受的任何不利或损害不承担任何责任。",
                  language,
                })}
              </ListItem>
            </UnorderedList>
            <Text className={styles.subTitle}>
              {getMessage({
                ja: "第6条（利用制限および登録抹消）",
                us: "Article 6 (Usage Restrictions and Deregistration)",
                cn: "第6条（使用限制及注销）",
                language,
              })}
            </Text>
            <UnorderedList>
              <ListItem>
                {getMessage({
                  ja: "当社は，ユーザーが以下のいずれかに該当する場合には，事前の通知なく，ユーザーに対して，本サービスの全部もしくは一部の利用を制限し，またはユーザーとしての登録を抹消することができるものとします。",
                  us: "The Company may restrict the use of all or part of the Service or deregister the user without prior notice if the user falls under any of the following.",
                  cn: "如果用户符合以下任何情况，公司可以在不事先通知的情况下限制用户使用全部或部分服务，或注销用户的注册。",
                  language,
                })}
              </ListItem>
              <Text h={4} />

              <OrderedList>
                <ListItem>
                  {getMessage({
                    ja: "本規約のいずれかの条項に違反した場合",
                    us: "If the user violates any of the provisions of these Terms",
                    cn: "如果用户违反本条款的任何规定",
                    language,
                  })}
                </ListItem>
                <ListItem>
                  {getMessage({
                    ja: "登録事項に虚偽の事実があることが判明した場合",
                    us: "If it is found that there are false facts in the registration details",
                    cn: "如果发现注册信息中有虚假事实",
                    language,
                  })}
                </ListItem>
                <ListItem>
                  {getMessage({
                    ja: "料金等の支払債務の不履行があった場合",
                    us: "If there is a default in payment obligations such as fees",
                    cn: "如果存在费用等支付义务的违约",
                    language,
                  })}
                </ListItem>
                <ListItem>
                  {getMessage({
                    ja: "当社からの連絡に対し，一定期間返答がない場合",
                    us: "If there is no response for a certain period to communications from the Company",
                    cn: "如果在一定时间内未对公司的联系作出回应",
                    language,
                  })}
                </ListItem>
                <ListItem>
                  {getMessage({
                    ja: "本サービスについて，最終の利用から一定期間利用がない場合",
                    us: "If there is no use of the service for a certain period after the last use",
                    cn: "如果自上次使用后在一定时间内未使用服务",
                    language,
                  })}
                </ListItem>
                <ListItem>
                  {getMessage({
                    ja: "その他，当社が本サービスの利用を適当でないと判断した場合",
                    us: "Other cases where the Company determines that the use of the service is inappropriate",
                    cn: "公司认为服务使用不当的其他情况",
                    language,
                  })}
                </ListItem>
              </OrderedList>
              <Text h={4} />

              <ListItem>
                {getMessage({
                  ja: "当社は，本条に基づき当社が行った行為によりユーザーに生じた損害について，一切の責任を負いません。",
                  us: "The Company shall not be liable for any damage caused to the user by actions taken by the Company based on this article.",
                  cn: "公司对根据本条采取的行动对用户造成的任何损害不承担任何责任。",
                  language,
                })}
              </ListItem>
            </UnorderedList>
            <Text className={styles.subTitle}>
              {getMessage({
                ja: "第7条（退会）",
                us: "Article 7 (Withdrawal)",
                cn: "第7条（退出）",
                language,
              })}
            </Text>
            <Text>
              {getMessage({
                ja: "ユーザーは，当社の定める退会手続により，本サービスから退会できるものとします。",
                us: "The user may withdraw from the service through the withdrawal procedure specified by the Company.",
                cn: "用户可以通过公司规定的退出程序退出服务。",
                language,
              })}
            </Text>
            <Text className={styles.subTitle}>
              {getMessage({
                ja: "第8条（保証の否認および免責事項）",
                us: "Article 8 (Disclaimer of Warranties and Limitation of Liability)",
                cn: "第8条（保证的否认及责任限制）",
                language,
              })}
            </Text>
            <OrderedList>
              <ListItem>
                {getMessage({
                  ja: "当社は，本サービスに事実上または法律上の瑕疵（安全性，信頼性，正確性，完全性，有効性，特定の目的への適合性，セキュリティなどに関する欠陥，エラーやバグ，権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。",
                  us: "The Company does not explicitly or implicitly guarantee that the service is free from factual or legal defects (including defects, errors, bugs, infringement of rights, etc. related to safety, reliability, accuracy, completeness, effectiveness, suitability for a particular purpose, security, etc.).",
                  cn: "公司不明示或暗示保证服务不存在事实或法律上的瑕疵（包括与安全性、可靠性、准确性、完整性、有效性、特定目的的适用性、安全性等相关的缺陷、错误、漏洞、权利侵害等）。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "当社は，本サービスに起因してユーザーに生じたあらゆる損害について、当社の故意又は重過失による場合を除き、一切の責任を負いません。ただし，本サービスに関する当社とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合，この免責規定は適用されません。",
                  us: "The Company shall not be liable for any damage caused to the user due to the service, except in cases of willful misconduct or gross negligence by the Company. However, if the contract between the Company and the user regarding the service (including these Terms) constitutes a consumer contract as defined by the Consumer Contract Act, this disclaimer shall not apply.",
                  cn: "公司对因服务导致用户遭受的任何损害不承担责任，除非是公司故意或重大过失的情况。但是，如果公司与用户之间关于服务的合同（包括本条款）构成《消费者合同法》定义的消费者合同，则本免责声明不适用。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "前項ただし書に定める場合であっても，当社は，当社の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（当社またはユーザーが損害発生につき予見し，または予見し得た場合を含みます。）について一切の責任を負いません。また，当社の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害の賠償は，ユーザーから当該損害が発生した月に受領した利用料の額を上限とします。",
                  us: "Even in the case specified in the proviso of the preceding paragraph, the Company shall not be liable for any damage caused to the user due to non-performance of obligations or torts caused by the Company's negligence (excluding gross negligence), including damages arising from special circumstances (including cases where the Company or the user foresaw or could have foreseen the occurrence of the damage). In addition, compensation for damages caused to the user due to non-performance of obligations or torts caused by the Company's negligence (excluding gross negligence) shall be limited to the amount of usage fees received from the user in the month in which the damage occurred.",
                  cn: "即使在前款但书规定的情况下，公司对因公司过失（不包括重大过失）导致的债务不履行或侵权行为对用户造成的损害不承担责任，包括因特殊情况导致的损害（包括公司或用户预见或可能预见到损害发生的情况）。此外，对因公司过失（不包括重大过失）导致的债务不履行或侵权行为对用户造成的损害的赔偿，限于用户在损害发生的月份支付的使用费金额。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "当社は，本サービスに関して，ユーザーと他のユーザーまたは第三者との間において生じた取引，連絡または紛争等について一切責任を負いません。",
                  us: "The Company shall not be liable for any transactions, communications, or disputes that arise between the user and other users or third parties in connection with the service.",
                  cn: "公司对用户与其他用户或第三方之间因服务而产生的任何交易、通信或争议不承担责任。",
                  language,
                })}
              </ListItem>
            </OrderedList>
            <Text className={styles.subTitle}>
              {getMessage({
                ja: "第9条（サービス内容の変更等）",
                us: "Article 9 (Changes to Service Content, etc.)",
                cn: "第9条（服务内容的变更等）",
                language,
              })}
            </Text>
            <Text>
              {getMessage({
                ja: "当社は，ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。",
                us: "The Company may change, add, or discontinue the content of the service with prior notice to the user, and the user shall agree to this.",
                cn: "公司可以在事先通知用户的情况下更改、添加或终止服务内容，用户应对此表示同意。",
                language,
              })}
            </Text>

            <Text className={styles.subTitle}>
              {getMessage({
                ja: "第10条（利用規約の変更）",
                us: "Article 10 (Changes to Terms of Use)",
                cn: "第10条（使用条款的变更）",
                language,
              })}
            </Text>

            <OrderedList>
              <ListItem>
                {getMessage({
                  ja: "当社は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。",
                  us: "The Company may change these Terms without the individual consent of the user in the following cases.",
                  cn: "在以下情况下，公司可以在不征得用户个别同意的情况下更改本条款。",
                  language,
                })}
              </ListItem>
              <Text h={4} />

              <UnorderedList>
                <ListItem>
                  {getMessage({
                    ja: "本規約の変更がユーザーの一般の利益に適合するとき。",
                    us: "When the change to the Terms is in the general interest of the user.",
                    cn: "当条款的变更符合用户的一般利益时。",
                    language,
                  })}
                </ListItem>
                <ListItem>
                  {getMessage({
                    ja: "本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき。",
                    us: "When the change to the Terms does not contradict the purpose of the service use contract and is reasonable in light of the necessity of the change, the appropriateness of the content after the change, and other circumstances related to the change.",
                    cn: "当条款的变更不违背服务使用合同的目的，并且在变更的必要性、变更后内容的适当性及其他与变更相关的情况的照应下是合理的。",
                    language,
                  })}
                </ListItem>
              </UnorderedList>
              <Text h={4} />

              <ListItem>
                {getMessage({
                  ja: "当社はユーザーに対し、前項による本規約の変更にあたり、事前に、本規約を変更する旨及び変更後の本規約の内容並びにその効力発生時期を通知します。",
                  us: "The Company will notify the user in advance of the change to these Terms, the content of the Terms after the change, and the effective date of the change, in accordance with the preceding paragraph.",
                  cn: "公司将根据前款规定，事先通知用户本条款的变更、变更后的条款内容及其生效日期。",
                  language,
                })}
              </ListItem>
            </OrderedList>

            <Text className={styles.subTitle}>
              {getMessage({
                ja: "第11条（個人情報の取扱い）",
                us: "Article 11 (Handling of Personal Information)",
                cn: "第11条（个人信息的处理）",
                language,
              })}
            </Text>
            <Text>
              {getMessage({
                ja: "当社は，本サービスの利用によって取得する個人情報については，当社「プライバシーポリシー」に従い適切に取り扱うものとします。",
                us: "The Company shall handle personal information obtained through the use of the service appropriately in accordance with the Company's 'Privacy Policy'.",
                cn: "公司应根据公司的《隐私政策》适当处理通过使用服务获得的个人信息。",
                language,
              })}
            </Text>
            <Text className={styles.subTitle}>
              {getMessage({
                ja: "第12条（通知または連絡）",
                us: "Article 12 (Notices or Communications)",
                cn: "第12条（通知或联系）",
                language,
              })}
            </Text>
            <Text>
              {getMessage({
                ja: "ユーザーと当社との間の通知または連絡は，当社の定める方法によって行うものとします。当社は,ユーザーから,当社が別途定める方式に従った変更届け出がない限り,現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い,これらは,発信時にユーザーへ到達したものとみなします。",
                us: "Notices or communications between the user and the Company shall be made in the manner prescribed by the Company. Unless the user submits a change notification in accordance with the method separately specified by the Company, the Company will consider the currently registered contact information to be valid and will send notices or communications to that contact information, which will be deemed to have reached the user at the time of transmission.",
                cn: "用户与公司之间的通知或联系应按照公司规定的方式进行。除非用户按照公司另行规定的方式提交变更通知，否则公司将视当前注册的联系信息为有效，并将通知或联系发送至该联系信息，且这些信息将在发送时视为已到达用户。",
                language,
              })}
            </Text>
            <Text className={styles.subTitle}>
              {getMessage({
                ja: "第13条（権利義務の譲渡の禁止）",
                us: "Article 13 (Prohibition of Assignment of Rights and Obligations)",
                cn: "第13条（权利义务的转让禁止）",
                language,
              })}
            </Text>
            <Text>
              {getMessage({
                ja: "ユーザーは，当社の書面による事前の承諾なく，利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し，または担保に供することはできません。",
                us: "The user may not assign or pledge to a third party the status under the service use contract or the rights or obligations under these Terms without the prior written consent of the Company.",
                cn: "未经公司事先书面同意，用户不得将服务使用合同下的地位或本条款下的权利或义务转让或质押给第三方。",
                language,
              })}
            </Text>
            <Text className={styles.subTitle}>
              {getMessage({
                ja: "第14条（準拠法・裁判管轄）",
                us: "Article 14 (Governing Law and Jurisdiction)",
                cn: "第14条（适用法律及管辖法院）",
                language,
              })}
            </Text>

            <OrderedList>
              <ListItem>
                {getMessage({
                  ja: "本規約の解釈にあたっては，日本法を準拠法とします。",
                  us: "The interpretation of these Terms shall be governed by Japanese law.",
                  cn: "本条款的解释应受日本法律管辖。",
                  language,
                })}
              </ListItem>
              <ListItem>
                {getMessage({
                  ja: "本サービスに関して紛争が生じた場合には，当社の本店所在地を管轄する裁判所を専属的合意管轄とします。",
                  us: "In the event of a dispute arising in connection with the service, the court having jurisdiction over the location of the Company's head office shall be the exclusive agreed jurisdiction.",
                  cn: "如果因服务而产生争议，则公司总部所在地的管辖法院应为专属约定管辖法院。",
                  language,
                })}
              </ListItem>
            </OrderedList>
            <Text h={12} />

            <Text>
              {getMessage({
                ja: "2022年4月22日 策定",
                us: "Established on April 22, 2022",
                cn: "2022年4月22日制定",
                language,
              })}
            </Text>
            <Box h="6px"></Box>
            <Text>
              {getMessage({
                ja: "2022年5月30日 改訂",
                us: "Revised on May 30, 2022",
                cn: "2022年5月30日修订",
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
