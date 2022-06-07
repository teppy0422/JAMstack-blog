import React from "react";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import styles from "../styles/home.module.scss";

const imageGalley = ({ fetchData }) => {
  return (
    <>
      <Box className={styles.imageGalley}>
        {fetchData.map((data) => (
          <a href={data.pageURL} target="_blank">
            <img
              key={data.key}
              className={styles.image}
              width={240}
              src={data.largeImageURL}
              alt=""
            />
          </a>
        ))}
      </Box>
    </>
  );
};

export default imageGalley;
