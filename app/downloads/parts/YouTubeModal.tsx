"use client";

import React from "react";
import { ChakraProvider, Box, useDisclosure } from "@chakra-ui/react";

import CustomModal from "@/components/ui/CustomModal";
import CustomModalTab from "./CustomModalTab";
import YouTubeFrame from "app/youtube/parts/YouTubeFrame";

type YouTubeModalProps = {
  text: string;
  initialVideoId: string;
  isModal?: boolean;
};
export const YouTubeModal: React.FC<YouTubeModalProps> = ({
  text,
  initialVideoId,
  isModal = false,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <CustomModalTab path="/" text={text} media="movie" onOpen={onOpen} />
      <CustomModal
        title=""
        isOpen={isOpen}
        onClose={onClose}
        modalSize={{ base: "sm", md: "lg", lg: "2xl" }}
        macCloseButtonHandlers={[onClose]}
        footer={<></>}
      >
        {isModal ? (
          <Box h="50vh" overflow="auto">
            <YouTubeFrame initialVideoId={initialVideoId} isModal={true} />
          </Box>
        ) : (
          <YouTubeFrame initialVideoId={initialVideoId} isModal={true} />
        )}
      </CustomModal>
    </>
  );
};

export default YouTubeModal;
