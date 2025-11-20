import { Box, Flex, Avatar, Text, useColorMode } from "@chakra-ui/react";
import { children } from "../data/childrenData";

type Props = {
  selectedChildIds: string[];
  onToggleChild: (childId: string) => void;
};

export default function ChildrenList({
  selectedChildIds,
  onToggleChild,
}: Props) {
  const { colorMode } = useColorMode();

  const calculateAge = (birthdate: string) => {
    const birth = new Date(birthdate);
    const today = new Date();
    const ageInYears = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const ageInMonths = ageInYears * 12 + monthDiff;

    if (ageInYears < 1) {
      return `${ageInMonths}ヶ月`;
    }
    return `${ageInYears}歳`;
  };

  return (
    <Flex gap={4} justifyContent="center" flexWrap="wrap">
      {children.map((child) => {
        const isSelected = selectedChildIds.includes(child.id);
        return (
          <Box
            key={child.id}
            p={2}
            borderWidth="2px"
            borderRadius="lg"
            borderColor={isSelected ? "blue.500" : "gray.300"}
            bg={
              isSelected
                ? colorMode === "light"
                  ? "blue.50"
                  : "blue.900"
                : "transparent"
            }
            cursor="pointer"
            onClick={() => onToggleChild(child.id)}
            transition="all 0.2s"
            _hover={{
              borderColor: "blue.400",
              transform: "translateY(-2px)",
              shadow: "md",
            }}
            minW="200px"
            opacity={isSelected ? 1 : 0.5}
          >
            <Flex direction="column" alignItems="center" gap={0}>
              <Avatar
                size="xl"
                name={child.name}
                src={child.avatarUrl}
                bg={child.gender === "male" ? "blue.500" : "pink.500"}
              />
              <Text fontSize="lg" fontWeight="bold">
                {child.name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {calculateAge(child.birthdate)}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {child.birthdate}
              </Text>
            </Flex>
          </Box>
        );
      })}
    </Flex>
  );
}
