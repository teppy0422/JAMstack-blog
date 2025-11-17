import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
  List,
  ListItem,
  Badge,
  Text,
  useColorMode,
  Link,
  Divider,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  SiPython,
  SiDotnet,
  SiJavascript,
  SiTypescript,
  SiCplusplus,
  SiCsharp,
  SiReact,
  SiNodedotjs,
  SiGithub,
} from "react-icons/si";

type TechStackItem = {
  category: string;
  name: string;
  version?: string;
  description?: string;
  libraries?: string[];
  githubUrl?: string;
  icon?: any;
  iconColor?: string;
};

type TechStackAccordionProps = {
  techStack: TechStackItem[];
};

export const TechStackAccordion = ({ techStack }: TechStackAccordionProps) => {
  const { colorMode } = useColorMode();

  return (
    <Accordion allowMultiple mt={0} borderColor="transparent" w="100%">
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton p="0" pl="7px">
              <Flex flex="1" textAlign="left" alignItems="center" fontSize="xs">
                <Box
                  fontSize={isExpanded ? "sm" : "xs"}
                  py="1px"
                  px="0"
                  transition="all 0.3s ease-in-out"
                >
                  開発
                </Box>
                <AccordionIcon
                  ml={2}
                  transform={isExpanded ? "rotate(180deg)" : "rotate(0deg)"}
                  transition="transform 0.2s ease-in-out"
                />
              </Flex>
            </AccordionButton>
            <AccordionPanel fontSize="xs" pt={0} px={0} pb={2}>
              <List spacing={0} styleType="none" pl={0}>
                {techStack.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <Box h=".5px" width="100%" bg="gray.500" m={0} p={0} />
                      <ListItem m={0} pl={1} pt={0.5} pb={1}>
                        <Flex direction="column">
                          <Flex alignItems="center" mb={1}>
                            {item.icon && (
                              <Icon
                                as={item.icon}
                                color={item.iconColor || "gray.500"}
                                boxSize={5}
                                m={1}
                              />
                            )}
                            <Box
                              as="span"
                              fontSize="14px"
                              fontWeight="900"
                              color={
                                colorMode === "light"
                                  ? "custom.theme.light.900"
                                  : "white"
                              }
                            >
                              {item.name}
                            </Box>
                            {item.version && (
                              <Box
                                as="span"
                                fontSize="xs"
                                fontWeight="normal"
                                ml={2}
                                color="gray.500"
                              >
                                {item.version}
                              </Box>
                            )}
                          </Flex>
                          <Box px={7}>
                            <Divider borderColor="gray.500" h=".5px" />
                          </Box>
                          <Box ml={6}>
                            {item.githubUrl && (
                              <Link
                                href={item.githubUrl}
                                isExternal
                                ml={1}
                                mt={2}
                                display="flex"
                                alignItems="center"
                                fontSize="xs"
                                color="gray.700"
                                _hover={{ color: "gray.900" }}
                              >
                                <Icon as={SiGithub} boxSize={5} mr={1} />
                                <Text>{item.githubUrl}</Text>
                              </Link>
                            )}
                            {item.libraries && item.libraries.length > 0 && (
                              <Box pl={1} mt={3}>
                                {item.libraries.map((lib, i) => {
                                  const [libName, ...versionParts] =
                                    lib.split(",");
                                  const libVersion = versionParts.join(",");
                                  return (
                                    <Flex key={i} alignItems="center" mb={1}>
                                      <Badge
                                        color="white"
                                        bg="gray.600"
                                        fontSize="0.6rem"
                                        px={1}
                                        py={0.5}
                                      >
                                        {libName.trim()}
                                      </Badge>
                                      {libVersion && (
                                        <Text
                                          fontSize="xs"
                                          ml={1}
                                          color="gray.500"
                                        >
                                          {libVersion.trim()}
                                        </Text>
                                      )}
                                    </Flex>
                                  );
                                })}
                              </Box>
                            )}
                            {item.description && (
                              <Box pl={1} mt={2} fontSize="xs">
                                {item.description}
                              </Box>
                            )}
                          </Box>
                        </Flex>
                      </ListItem>
                    </React.Fragment>
                  );
                })}
              </List>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

// アイコンのエクスポート（利用時に使用）
export const TechIcons = {
  Python: SiPython,
  VBNet: SiDotnet,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  CPlusPlus: SiCplusplus,
  CSharp: SiCsharp,
  React: SiReact,
  Node: SiNodedotjs,
};

// カラーのプリセット
export const TechColors = {
  Python: "#3776AB",
  VBNet: "#512BD4",
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  CPlusPlus: "#00599C",
  CSharp: "#239120",
  React: "#61DAFB",
  Node: "#339933",
};
