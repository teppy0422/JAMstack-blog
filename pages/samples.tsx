import React from "react";
import {
  Box,
  Heading,
  Link,
  VStack,
  Container,
  Image,
  Text,
} from "@chakra-ui/react";
import Sidebar from "../components/sidebar";
import Content from "../components/content";

const samples = [
  { name: "サンプル1", path: "/sample1", thumbnail: "/images/sample1.png" },
  { name: "サンプル2", path: "/sample2", thumbnail: "/images/sample2.png" },
  // 他のサンプルページをここに追加
];

const Samples = () => {
  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true}>
        <Container maxW="container.lg" py={8}>
          <Heading as="h1" mb={8} textAlign="center" color="teal.500">
            サンプルページリンク集
          </Heading>
          <VStack spacing={4} align="stretch">
            {samples.map((sample, index) => (
              <Box
                key={index}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="md"
                _hover={{ bg: "teal.50" }}
                transition="background-color 0.2s"
              >
                <Link
                  href={sample.path}
                  color="teal.500"
                  _hover={{ textDecoration: "none" }}
                >
                  <Box display="flex" alignItems="center">
                    <Image
                      src={sample.thumbnail}
                      alt={sample.name}
                      boxSize="50px"
                      mr={4}
                    />
                    <Text>{sample.name}</Text>
                  </Box>
                </Link>
              </Box>
            ))}
          </VStack>
        </Container>
      </Content>
    </>
  );
};

export default Samples;
