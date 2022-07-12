import { Box, Badge, StylesProvider, VStack } from "@chakra-ui/react";
import NextImage from "next/image";
import { StarIcon } from "@chakra-ui/icons";

import styles from "../styles/home.module.scss";

export default function imageCard(pops) {
  const property = {
    imageUrl: pops.eyeCatchPath,
    imageAlt: "Rear view of modern home with pool",
    title: pops.title,
    formattedPrice: pops.subTitle,
    reviewCount: pops.users,
    rating: pops.rate,
    skillTags: pops.skillTags,
  };

  return (
    <Box
      className={styles.imageCard}
      maxW="xs"
      borderWidth="1px"
      borderRadius="10px"
      overflow="hidden"
      borderColor="gray.400"
      mx="16px"
      my="8px"
      width="300px"
      boxShadow="md"
    >
      <NextImage
        src={property.imageUrl}
        alt={property.imageAlt}
        width={300}
        height={200}
        layout="responsive"
        objectFit="cover"
        style={{
          position: "relative",
          width: "100px",
          height: "100px",
          borderRadius: "8px 8px 0 0",
        }}
      />

      <Box textAlign="left" p="3.5">
        <Box alignItems="baseline">
          {property.skillTags.map((item, index) => {
            return (
              <Badge
                key={index}
                borderRadius="full"
                px="2"
                mx="2px"
                colorScheme={item.skillColor}
              >
                {item.skillName}
              </Badge>
            );
          })}
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          noOfLines={1}
        >
          {property.title}
        </Box>

        <Box>{property.formattedPrice}</Box>

        <Box display="flex" mt="2" alignItems="center">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <StarIcon
                key={i}
                color={i < property.rating ? "teal.500" : "gray.300"}
              />
            ))}
          <Box as="span" ml="2" color="gray.600" fontSize="sm">
            {property.reviewCount} users
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
