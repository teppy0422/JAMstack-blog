import { useState } from "react";
import {
  Box,
  Image,
  Button,
  HStack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { transform } from "lodash";

type MediaItem = {
  id: number;
  url: string;
  comment?: string;
};

type Props = {
  images: MediaItem[];
};

export const ImageSelector = ({ images }: Props) => {
  const { colorMode } = useColorMode();
  const [selectedImageId, setSelectedImageId] = useState(images[0]?.id ?? 1);
  const selectedImage = images.find((img) => img.id === selectedImageId);

  // URLから拡張子を判定して動画かどうかを判定
  const isVideo = (url: string) => {
    const videoExtensions = [".mp4", ".webm", ".mov", ".avi"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  return (
    <Box textAlign="center">
      <HStack justify="center" spacing={4} mb={2}>
        {images.map((img) => (
          <Box
            key={img.id}
            onClick={() => setSelectedImageId(img.id)}
            bg={
              selectedImageId === img.id
                ? "custom.theme.light.850"
                : "custom.theme.light.600"
            }
            color={
              selectedImageId === img.id
                ? "custom.theme.light.50"
                : "custom.theme.light.900"
            }
            h="24px"
            w="24px"
            cursor="pointer"
            _hover={{ transform: "scale(1.1)", opacity: "0.8" }}
          >
            {img.id}
          </Box>
        ))}
      </HStack>
      {selectedImage && (
        <>
          {selectedImage.comment && (
            <Text
              mt={2}
              fontSize="sm"
              color={colorMode === "light" ? "gray.600" : "gray.100"}
              whiteSpace="pre-line"
            >
              {selectedImage.comment}
            </Text>
          )}
          {isVideo(selectedImage.url) ? (
            <Box
              as="video"
              src={selectedImage.url}
              controls
              autoPlay
              loop
              muted
              playsInline
              maxW="100%"
              maxH="100%"
              mx="auto"
              boxShadow="md"
            />
          ) : (
            <Image
              src={selectedImage.url}
              alt={`Image ${selectedImage.id}`}
              maxW="100%"
              maxH="100%"
              mx="auto"
              boxShadow="md"
            />
          )}
        </>
      )}
    </Box>
  );
};
