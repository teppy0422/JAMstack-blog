"use client";
import {
  useDisclosure,
  Text,
  IconButton,
  Flex,
  Box,
  HStack,
  Icon,
  Spacer,
  Tooltip,
  Grid,
  GridItem,
  Image,
} from "@chakra-ui/react";
import { FaQuestion } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";
import CustomModal from "@/components/ui/CustomModal";
import ModalButton from "@/components/ui/ModalButton";
import { deflate } from "zlib";

export function AboutObjectOriented() {
  const { language, setLanguage } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <ModalButton
        label={getMessage({
          ja: "オブジェクト指向",
          us: "object-oriented",
          cn: "面向对象",
          language,
        })}
        onClick={onOpen}
      />
      <CustomModal
        title={getMessage({
          ja: "オブジェクト指向",
          us: "object-oriented",
          cn: "面向对象",
          language,
        })}
        isOpen={isOpen}
        onClose={onClose}
        modalSize="lg"
        macCloseButtonHandlers={[onClose]}
        footer={<></>}
      >
        <Box bg="custom.system.500" p={4} maxH="60vh" overflowY="auto">
          {/* セクション1：オブジェクト指向とは */}
          <Box
            borderRadius="md"
            p={4}
            border="1px solid #4c4b49"
            color="#ccc"
            py={3}
            fontSize="13px"
            mt={3}
          >
            <Text fontWeight="bold" fontSize="12px">
              {"1. " +
                getMessage({
                  ja: "オブジェクト指向とは",
                  us: "What is Object-Oriented Programming?",
                  cn: "什么是面向对象编程？",
                  language,
                })}
            </Text>
            <Box h="1px" w="100%" bg="#4c4b49" my={2} />
            <Text>
              {getMessage({
                ja: "オブジェクト指向は、データと処理を1つの「オブジェクト」としてまとめて扱う考え方です。",
                us: "Object-oriented programming organizes data and behavior into units called 'objects'.",
                cn: "面向对象编程将数据和行为组织为一个单元，称为“对象”。",
                language,
              })}
            </Text>
            <Text mt={2}>
              {getMessage({
                ja: "プログラムを『クラス』『インスタンス』『継承』『カプセル化』『ポリモーフィズム』といった要素で構築します。",
                us: "It is built on concepts like class, instance, inheritance, encapsulation, and polymorphism.",
                cn: "它基于类、实例、继承、封装和多态等概念构建程序。",
                language,
              })}
            </Text>
          </Box>

          {/* セクション2：主な概念 */}
          <Box
            borderRadius="md"
            p={4}
            border="1px solid #4c4b49"
            color="#ccc"
            py={3}
            fontSize="13px"
            mt={4}
          >
            <Text fontWeight="bold" fontSize="12px">
              {"2. " +
                getMessage({
                  ja: "主な概念",
                  us: "Key Concepts",
                  cn: "主要概念",
                  language,
                })}
            </Text>
            <Box h="1px" w="100%" bg="#4c4b49" my={2} />

            <Text mt={2}>
              <strong>・クラス：</strong>
              {getMessage({
                ja: "オブジェクトの設計図。属性や動作（メソッド）を定義します。",
                us: "A blueprint of objects. Defines attributes and methods.",
                cn: "对象的蓝图。定义属性和方法。",
                language,
              })}
            </Text>
            <Text mt={2}>
              <strong>・インスタンス：</strong>
              {getMessage({
                ja: "クラスから作られる具体的なオブジェクトです。",
                us: "A specific object created from a class.",
                cn: "从类创建的具体对象。",
                language,
              })}
            </Text>
            <Text mt={2}>
              <strong>・継承：</strong>
              {getMessage({
                ja: "親クラスの機能を子クラスが受け継ぎ、再利用します。",
                us: "Allows a subclass to inherit functionality from a parent class.",
                cn: "子类可以继承父类的功能。",
                language,
              })}
            </Text>
            <Text mt={2}>
              <strong>・カプセル化：</strong>
              {getMessage({
                ja: "内部の実装を隠し、外部にはインターフェースだけを公開します。",
                us: "Hides internal details and exposes only the interface.",
                cn: "隐藏内部实现，仅公开接口。",
                language,
              })}
            </Text>
            <Text mt={2}>
              <strong>・ポリモーフィズム：</strong>
              {getMessage({
                ja: "同じ名前のメソッドで、異なる振る舞いが可能になります。",
                us: "Allows the same method name to behave differently in different classes.",
                cn: "允许相同的方法名在不同类中表现出不同的行为。",
                language,
              })}
            </Text>
          </Box>

          {/* セクション3：まとめ */}
          <Box
            borderRadius="md"
            p={4}
            border="1px solid #4c4b49"
            color="#ccc"
            py={3}
            fontSize="13px"
            mt={4}
          >
            <Text fontWeight="bold" fontSize="12px">
              {"3. " +
                getMessage({
                  ja: "まとめ",
                  us: "Summary",
                  cn: "总结",
                  language,
                })}
            </Text>
            <Box h="1px" w="100%" bg="#4c4b49" my={2} />
            <Text>
              {getMessage({
                ja: "オブジェクト指向は、保守性と再利用性を高める現代的なプログラミング手法です。",
                us: "OOP is a modern programming approach that improves maintainability and reusability.",
                cn: "面向对象编程是一种提高可维护性和可重用性的现代编程方法。",
                language,
              })}
            </Text>
          </Box>
          <Box
            borderRadius="md"
            p={4}
            border="1px solid #4c4b49"
            color="#ccc"
            py={3}
            fontSize="13px"
            mt={4}
          >
            <Text fontWeight="bold" fontSize="12px">
              {"4. " +
                getMessage({
                  ja: "Excel VBAとオブジェクト指向",
                  us: "Excel VBA and OOP",
                  cn: "Excel VBA与面向对象",
                  language,
                })}
            </Text>
            <Box h="1px" w="100%" bg="#4c4b49" my={2} />
            <Text>
              {getMessage({
                ja: "VBAは基本的には手続き型ですが、クラスモジュールを使うことでオブジェクト指向的なコードを書くことも可能です。",
                us: "Although VBA is procedural, it allows object-oriented programming through class modules.",
                cn: "虽然VBA是过程式语言，但通过类模块也可以实现面向对象编程。",
                language,
              })}
            </Text>
            <Text mt={2}>
              {getMessage({
                ja: "例えば、クラスを定義してインスタンスを生成したり、プロパティやメソッドを使って振る舞いを実装できます。",
                us: "You can define classes, create instances, and implement behaviors with properties and methods.",
                cn: "您可以定义类、创建实例，并使用属性和方法实现行为。",
                language,
              })}
            </Text>
            <Text mt={2}>
              {getMessage({
                ja: "ただし、多重継承や高度なポリモーフィズムなど、他の言語に比べて制限はあります。",
                us: "However, compared to other languages, features like multiple inheritance or advanced polymorphism are limited.",
                cn: "但与其他语言相比，VBA在多重继承或高级多态等方面有一定限制。",
                language,
              })}
            </Text>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
}

export default AboutObjectOriented;
