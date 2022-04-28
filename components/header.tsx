import { Flex, Center, Text, VStack, Box, IconButton } from "@chakra-ui/react";
import { PhoneIcon, AddIcon, WarningIcon, MoonIcon } from "@chakra-ui/icons";

import styles from "../styles/home.module.scss";

export default function Header() {
  return (
    <div>
      <VStack>
        <Flex color="white" className={styles.TopHeader}>
          <Center w="100px" bg="gray.700">
            <Text>TeppyBlog</Text>
          </Center>
          <Center flex="1" bg="gray.600">
            <Text>horizontal_area</Text>
          </Center>
          <Center w="100px" bg="gray.700">
            <IconButton
              colorScheme="purple"
              aria-label="Search database"
              icon={<MoonIcon />}
            />
          </Center>
        </Flex>
      </VStack>
    </div>
  );
}
