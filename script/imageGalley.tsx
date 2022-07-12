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
  Badge,
} from "@chakra-ui/react";
import styles from "../styles/home.module.scss";

const imageGalley = ({ fetchData }) => {
  return (
    <>
      <Box className={styles.imageGalley}>
        {fetchData.map((data) => {
          if (data.largeImageURL !== undefined) {
            return (
              <Box
                style={{
                  display: "inline-block",
                  margin: "16px 16px 0px 16px",
                  position: "relative",
                }}
              >
                <a href={data.pageURL} target="_blank">
                  <img
                    key={data.key}
                    className={styles.image}
                    width={240}
                    src={data.largeImageURL}
                    alt={data.id}
                  />
                </a>
                <Badge
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                  }}
                  colorScheme="green"
                >
                  PIXABAY
                </Badge>
                <Text
                  color="gray.200"
                  fontSize="13px"
                  style={{
                    position: "absolute",
                    right: "4px",
                    bottom: "6px",
                  }}
                >
                  {data.imageWidth}×{data.imageHeight}
                </Text>
              </Box>
            );
          } else if (data.url_s !== undefined) {
            return (
              <Box
                style={{
                  display: "inline-block",
                  margin: "16px 16px 0px 16px",
                  position: "relative",
                }}
              >
                <a href={data.url_o} target="_blank">
                  <img
                    key={data.id}
                    className={styles.image}
                    width={240}
                    src={data.url_s}
                    alt=""
                  />
                </a>
                <Badge
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                  }}
                  colorScheme="blue"
                >
                  FLICKR
                </Badge>
                <Text
                  color="gray.200"
                  fontSize="13px"
                  style={{
                    position: "absolute",
                    right: "4px",
                    bottom: "6px",
                  }}
                >
                  {data.width_o}×{data.height_o}
                </Text>
              </Box>
            );
          }
        })}
      </Box>
    </>
  );
};

export default imageGalley;
