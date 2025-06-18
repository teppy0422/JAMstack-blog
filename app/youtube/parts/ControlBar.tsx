import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HStack, Box } from "@chakra-ui/react";
import { IoIosPlay, IoIosPause } from "react-icons/io";

const MotionHStack = motion(HStack);
const MotionBox = motion(Box);

type ControlBarProps = {
  rewindPlay: () => void;
  toggleVolume: () => void;
  isMuted: boolean;
  isPlaying: boolean;
  showAnimIcon: boolean;
};
export const ControlBar = memo(function ControlBar({
  rewindPlay,
  toggleVolume,
  isMuted,
  isPlaying,
  showAnimIcon,
}: ControlBarProps) {
  return (
    <>
      <AnimatePresence>
        {showAnimIcon && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            zIndex={999}
          >
            <MotionBox
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="#000"
              p={4}
              borderRadius="full"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {isPlaying ? <IoIosPlay size={32} /> : <IoIosPause size={32} />}
            </MotionBox>
          </Box>
        )}
      </AnimatePresence>

      <MotionHStack
        position="absolute"
        bottom={0}
        left="0"
        spacing={6}
        w="100%"
        m={4}
        pointerEvents="auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        style={{ willChange: "opacity, transform" }}
      >
        <Box
          as="svg"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="20px"
          width="20px"
          xmlns="http://www.w3.org/2000/svg"
          _hover={{ fill: "red", stroke: "red" }} // マウスオーバーで色を青に変更
          onClick={rewindPlay} // クリックで先頭に戻る
          cursor="pointer"
        >
          <path d="M19.496 4.136l-12 7a1 1 0 0 0 0 1.728l12 7a1 1 0 0 0 1.504 -.864v-14a1 1 0 0 0 -1.504 -.864z"></path>
          <path d="M4 4a1 1 0 0 1 .993 .883l.007 .117v14a1 1 0 0 1 -1.993 .117l-.007 -.117v-14a1 1 0 0 1 1 -1z"></path>
        </Box>
        <Box
          as="svg"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="20px"
          width="20px"
          xmlns="http://www.w3.org/2000/svg"
          _hover={{ fill: "red", stroke: "red" }}
          cursor="pointer"
        >
          <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z"></path>
        </Box>
        <Box
          as="svg"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="20px"
          width="20px"
          xmlns="http://www.w3.org/2000/svg"
          _hover={{ fill: "red", stroke: "red" }}
          // onClick={handleRewind} // クリックで先頭に戻る
          cursor="pointer"
        >
          <path d="M3 5v14a1 1 0 0 0 1.504 .864l12 -7a1 1 0 0 0 0 -1.728l-12 -7a1 1 0 0 0 -1.504 .864z"></path>
          <path d="M20 4a1 1 0 0 1 .993 .883l.007 .117v14a1 1 0 0 1 -1.993 .117l-.007 -.117v-14a1 1 0 0 1 1 -1z"></path>
        </Box>
        <Box
          as="svg"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="20px"
          width="20px"
          xmlns="http://www.w3.org/2000/svg"
          _hover={{ fill: "red", stroke: "red" }} // マウスオーバーで色を青に変更
          cursor="pointer"
          onClick={toggleVolume} // クリックでボリュームを切り替える
        >
          {isMuted ? (
            <path d="m7.727 6.313-4.02-4.02-1.414 1.414 18 18 1.414-1.414-2.02-2.02A9.578 9.578 0 0 0 21.999 12c0-4.091-2.472-7.453-5.999-9v2c2.387 1.386 3.999 4.047 3.999 7a8.13 8.13 0 0 1-1.671 4.914l-1.286-1.286C17.644 14.536 18 13.19 18 12c0-1.771-.775-3.9-2-5v7.586l-2-2V2.132L7.727 6.313zM4 17h2.697L14 21.868v-3.747L3.102 7.223A1.995 1.995 0 0 0 2 9v6c0 1.103.897 2 2 2z"></path>
          ) : (
            <>
              <path d="M16 21c3.527-1.547 5.999-4.909 5.999-9S19.527 4.547 16 3v2c2.387 1.386 3.999 4.047 3.999 7S18.387 17.614 16 19v2z"></path>
              <path d="M16 7v10c1.225-1.1 2-3.229 2-5s-.775-3.9-2-5zM4 17h2.697L14 21.868V2.132L6.697 7H4c-1.103 0-2 .897-2 2v6c0 1.103.897 2 2 2z"></path>
            </>
          )}
        </Box>
      </MotionHStack>
    </>
  );
});
export default ControlBar;
