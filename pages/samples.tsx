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
  useColorMode,
} from "@chakra-ui/react";
import Sidebar from "../components/sidebar";
import Content from "../components/content";

const samples = [
  {
    name: "56_配策図_誘導_Ver3.1",
    path: "/56v3.1",
    thumbnail: "/images/samples/56iPad.png",
  },
  // 他のサンプルページをここに追加
];

const Samples = () => {
  const { colorMode } = useColorMode();
  return (
    <>
      <Sidebar />
      <Content isCustomHeader={true}>
        <Container maxW="container.lg" py={8}>
          <Heading
            as="h1"
            mb={8}
            textAlign="center"
            color={colorMode === "light" ? "black" : "white"}
            fontFamily="Noto Sans JP"
            fontWeight="200"
          >
            サンプル一覧
          </Heading>
          <Badge variant="solid" colorScheme="green">
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
                color={colorMode === "light" ? "black" : "white"}
                _hover={{ textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
                mt={2}
              >
                <Box
                  key={index}
                  p={1}
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="md"
                  transition="background-color 0.2s"
                >
                  <Box display="flex" alignItems="center">
                    <Text fontFamily="Noto Serif JP" pl={2}>
                      {sample.name}
                    </Text>
                    <Image
                      src={sample.thumbnail}
                      alt={sample.thumbnail}
                      maxHeight="50px"
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
