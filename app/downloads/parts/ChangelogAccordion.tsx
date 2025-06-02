import React, { useState } from "react";

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
  ListIcon,
  Badge,
  PopoverBody,
  Popover,
  PopoverTrigger,
  LinkBox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { getColor } from "@/lib/getColor";

type ChangelogItem = {
  date: string;
  version: string;
  reason?: string[];
  change?: string[];
  inCharge?: string[];
  html?: string;
  htmlText?: string;
};
type ChangelogAccordionProps = {
  changelog: ChangelogItem[];
};

export const ChangelogAccordion = ({ changelog }: ChangelogAccordionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState("");
  const handleBoxClick = (src: string) => {
    setModalSrc(src);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <Accordion allowMultiple mt={0} borderColor="transparent">
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton p="0" pl="3px">
              <Flex flex="1" textAlign="left" alignItems="center" fontSize="xs">
                <Box fontSize="xs" py="1px" px="0">
                  更新履歴
                </Box>
                <AccordionIcon
                  ml={2}
                  transform={isExpanded ? "rotate(180deg)" : "rotate(0deg)"}
                  transition="transform 0.2s ease-in-out"
                />
              </Flex>
            </AccordionButton>
            <AccordionPanel pb={2} fontSize="xs" p={1}>
              <List spacing={1} styleType="none" pl={0}>
                {changelog.map((item, index) => (
                  <>
                    <Box h="1px" width="100%" bg="gray.500" />
                    <ListItem key={index}>
                      <Box as="span" fontSize="14px" fontWeight="400" mr={2}>
                        {item.version}
                      </Box>
                      <Box as="span" fontWeight="bold">
                        {item.date}
                      </Box>
                      {item.inCharge && item.inCharge.length > 0 && (
                        <>
                          {item.inCharge.map((name, i) => {
                            const { bg, color, borderColor } = getColor(name);
                            return (
                              <Badge
                                key={i}
                                bg={bg}
                                color={color}
                                border={borderColor ? "1px solid" : "none"}
                                borderColor={borderColor}
                                fontWeight={600}
                                fontSize="0.6rem"
                                ml={1}
                              >
                                {name}
                              </Badge>
                            );
                          })}
                        </>
                      )}
                      {item.reason && item.reason.length > 0 && (
                        <Box mt={1} pl={0}>
                          <List spacing={1} pl={0}>
                            {item.reason.map((r, i) => (
                              <ListItem key={i}>
                                <ListIcon
                                  as={WarningTwoIcon}
                                  color="red.500"
                                  mr={1}
                                />
                                {r}
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                      {item.change && item.change.length > 0 && (
                        <Box mt={1} pl={0}>
                          <List spacing={1} pl={0}>
                            {item.change.map((c, i) => (
                              <ListItem key={i}>
                                <ListIcon
                                  as={CheckCircleIcon}
                                  color="green.500"
                                  mr={1}
                                />
                                {c}
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </ListItem>
                    {item.htmlText && (
                      <>
                        <Popover placement="bottom">
                          <PopoverTrigger>
                            <LinkBox
                              as="article"
                              maxW="auto"
                              p="2"
                              borderWidth="1px"
                              rounded="md"
                              borderColor="gray.500"
                              _hover={{ boxShadow: "dark-lg" }}
                            >
                              <PopoverBody
                                height="auto"
                                style={{ border: "none" }}
                                p={1}
                                maxW="100%"
                              >
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Box
                                    position="relative"
                                    width={{
                                      base: "45%",
                                      sm: "45%",
                                      md: "45%",
                                      lg: "50%",
                                      xl: "50%",
                                    }} // 画面サイズに応じて変更
                                    height={{
                                      base: "100px",
                                      sm: "170px",
                                      md: "200px",
                                      lg: "190px",
                                      xl: "240px",
                                    }}
                                    border="none"
                                  >
                                    <iframe
                                      height="100%"
                                      src={
                                        item.html +
                                        item.version +
                                        `_/index.html`
                                      }
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        border: "none",
                                      }} // iframeのサイズを100%に設定
                                      title="Embedded Content"
                                    />
                                    <Box
                                      position="absolute"
                                      top="0"
                                      left="0"
                                      width="100%"
                                      height="100%"
                                      onClick={() =>
                                        handleBoxClick(
                                          item.html +
                                            item.version +
                                            `_/index.html`
                                        )
                                      }
                                      style={{
                                        cursor: "pointer",
                                        backgroundColor: "transparent",
                                      }} // 追加
                                    />
                                  </Box>
                                  <Box
                                    mx={1}
                                    fontSize="xl"
                                    color="gray.500"
                                    bg="transparent"
                                  >
                                    →
                                  </Box>
                                  <Box
                                    position="relative"
                                    width={{
                                      base: "45%",
                                      sm: "45%",
                                      md: "45%",
                                      lg: "50%",
                                      xl: "50%",
                                    }} // 画面サイズに応じて変更
                                    height={{
                                      base: "100px",
                                      sm: "170px",
                                      md: "200px",
                                      lg: "190px",
                                      xl: "240px",
                                    }}
                                    border="none"
                                  >
                                    <iframe
                                      height="100%"
                                      src={
                                        item.html + item.version + `/index.html`
                                      }
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        border: "none",
                                      }}
                                      title="Embedded Content"
                                    />
                                    <Box
                                      position="absolute"
                                      top="0"
                                      left="0"
                                      width="100%"
                                      height="100%"
                                      onClick={() =>
                                        handleBoxClick(
                                          item.html +
                                            item.version +
                                            `/index.html`
                                        )
                                      }
                                      style={{
                                        cursor: "pointer",
                                        backgroundColor: "transparent",
                                      }}
                                    />
                                  </Box>
                                </Box>
                                <Box h="1px" width="100%" bg="gray.500" />
                                <Text fontSize="sm" fontWeight={400}>
                                  {item.htmlText}
                                </Text>
                              </PopoverBody>
                            </LinkBox>
                          </PopoverTrigger>
                        </Popover>
                        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                          <ModalOverlay bg="rgba(0, 0, 0, 0.1)" />
                          <ModalContent maxW="90vw" maxH="90vh">
                            <ModalCloseButton _focus={{ boxShadow: "none" }} />
                            {/* <ModalHeader></ModalHeader> */}
                            <ModalBody mx={0}>
                              <Box
                                width="99%"
                                height={{
                                  base: "30vh",
                                  sm: "40vh",
                                  md: "50vh",
                                  lg: "70vh",
                                }}
                                border="none"
                                maxW="90vw"
                              >
                                <iframe
                                  src={modalSrc} // モーダルのsrcを設定
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                  }} // iframeのサイズを100%に設定
                                  title="Embedded Content"
                                />
                              </Box>
                            </ModalBody>
                          </ModalContent>
                        </Modal>
                      </>
                    )}
                  </>
                ))}
              </List>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};
