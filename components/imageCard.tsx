import { Box, Badge, StylesProvider } from "@chakra-ui/react";
import NextImage from "next/image";
import { StarIcon } from "@chakra-ui/icons";

import styles from "../styles/home.module.scss";

export default function imageCard(pops) {
  const property = {
    imageUrl: pops.eyeCatchPath,
    imageAlt: "Rear view of modern home with pool",
    beds: 3,
    baths: 2,
    title: pops.title,
    formattedPrice: "$1,900.00",
    reviewCount: pops.users,
    rating: pops.rate,
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

      <Box textAlign="left" p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="green">
            EXCEL
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {property.beds} beds &bull; {property.baths} baths
          </Box>
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

        <Box>
          {property.formattedPrice}
          <Box as="span" color="gray.900" fontSize="sm">
            / wk
          </Box>
        </Box>

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
