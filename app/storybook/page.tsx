// app/storybook/page.tsx
"use client";

import { Box, Grid, Heading, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import { storybooks } from "./storybooks";

export default function StorybookPage() {
  return (
    <Box p={6}>
      <Heading mb={6} textAlign="center" fontSize="3xl">
        えほんをえらんでね
      </Heading>
      <Grid
        templateColumns={{ base: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
        gap={6}
      >
        {storybooks.map((book) => (
          <Link key={book.id} href={`/storybook/books/${book.id}`}>
            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="md"
              p={4}
              textAlign="center"
              _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
            >
              <Image
                src={book.cover}
                alt={book.title}
                mx="auto"
                maxH="150px"
                objectFit="contain"
              />
              <Text mt={2} fontSize="xl">
                {book.title}
              </Text>
            </Box>
          </Link>
        ))}
      </Grid>
    </Box>
  );
}
