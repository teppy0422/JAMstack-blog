import React from "react";
import {
  Box,
  Heading,
  Link,
  VStack,
  Container,
  Image,
  Text,
  Badge,
} from "@chakra-ui/react";
import Sidebar from "../components/sidebar";
import Content from "../components/content";

const samples = [
  {
    name: "56_配策図_誘導_Ver3.1",
    path: "/56v3.1",
    thumbnail: "/images/sample1.png",
  },
  // 他のサンプルページをここに追加
];

const Samples = () => {
  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true}>
        <Container maxW="container.lg" py={8}>
          <Heading as="h1" mb={8} textAlign="center" color="teal.500">
            サンプル
          </Heading>
          <Badge variant="solid" colorScheme="green" ml={2}>
            使用者
          </Badge>
          <Badge variant="solid" colorScheme="purple" ml={2}>
            管理者
          </Badge>
          <Badge variant="solid" colorScheme="red" ml={2}>
            開発者
          </Badge>
          <VStack spacing={4} align="stretch">
            {samples.map((sample, index) => (
              <Link
                href={sample.path}
                color="teal.500"
                _hover={{ textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box
                  key={index}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="md"
                  _hover={{ bg: "teal.50" }}
                  transition="background-color 0.2s"
                >
                  <Box display="flex" alignItems="center">
                    <Text fontFamily="Noto Serif JP">{sample.name}</Text>
                    <Image
                      src={sample.thumbnail}
                      alt={sample.thumbnail}
                      boxSize="50px"
                      ml="auto"
                    />
                  </Box>
                </Box>
              </Link>
            ))}
          </VStack>
        </Container>
      </Content>
    </>
  );
};

export default Samples;
