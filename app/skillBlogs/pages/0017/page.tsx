"use client";

import React, { useRef } from "react";
import {
  Box,
  Heading,
  Text,
  HStack,
  Divider,
  Avatar,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import SectionBox from "../../components/SectionBox";
import Frame from "../../components/frame";

import { useLanguage } from "@/contexts/LanguageContext";
import getMessage from "@/utils/getMessage";

const BlogPage: React.FC = () => {
  const { language } = useLanguage();
  const { colorMode } = useColorMode();
  const sectionRefs = useRef<HTMLElement[]>([]);
  const sections = useRef<{ id: string; title: string }[]>([]);

  return (
    <Frame sections={sections} sectionRefs={sectionRefs}>
      <Box w="100%">
        <HStack spacing={2} align="center" mb={1} ml={1}>
          <Avatar
            size="xs"
            src="https://thlpowhlzoeoymvhzlyi.supabase.co/storage/v1/object/public/avatars/public/f46e43c2-f4f0-4787-b34e-a310cecc221a.webp"
            borderWidth={1}
          />
          <Text>@kataoka</Text>
          <Text>in</Text>
          <Text>
            {getMessage({
              ja: "開発",
              language,
            })}
          </Text>
        </HStack>
        <Heading fontSize="3xl" mb={1}>
          {getMessage({
            ja: "先ハメ誘導(SSC有り)の作り方",
            us: "How to create pre-fit guidance (with SSC)",
            cn: "先装配引导（含SSC）的制作方法",
            language,
          })}
        </Heading>
        <Text fontSize="sm" color={colorMode === "light" ? "gray.800" : "white"} mt={1}>
          {getMessage({ ja: "更新日", language })}:2026-08-24
        </Text>
      </Box>
      <SectionBox
        id="section1"
        title={
          "1." +
          getMessage({
            ja: "はじめに",
            language,
          })
        }
        sectionRefs={sectionRefs}
        sections={sections}
      >
        <Divider mt={2} borderColor={colorMode === "light" ? "black" : "white"} />
        <Box ml={4}>
          <Text>
            {getMessage({
              ja: "準備中です。",
              us: "Coming soon.",
              cn: "准备中。",
              language,
            })}
          </Text>
        </Box>
      </SectionBox>
    </Frame>
  );
};

export default BlogPage;
