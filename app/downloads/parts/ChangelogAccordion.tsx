import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
  List,
  ListItem,
} from "@chakra-ui/react";

type ChangelogItem = {
  version: string;
  description: string;
  date: string;
};

type ChangelogAccordionProps = {
  changelog: ChangelogItem[];
};

export const ChangelogAccordion = ({ changelog }: ChangelogAccordionProps) => {
  return (
    <Accordion allowMultiple mt={0} borderColor="transparent">
      <AccordionItem>
        {({ isExpanded }) => (
          <>
            <AccordionButton py="0">
              <Flex flex="1" textAlign="left" alignItems="center" fontSize="xs">
                <Box fontSize="xs" py="2px">
                  更新履歴
                </Box>
                <AccordionIcon
                  ml={2}
                  transform={isExpanded ? "rotate(180deg)" : "rotate(0deg)"}
                  transition="transform 0.2s ease-in-out"
                />
              </Flex>
            </AccordionButton>
            <AccordionPanel pb={2} fontSize="xs">
              <List spacing={1} styleType="disc" pl={3}>
                {changelog.map((item, index) => (
                  <ListItem key={index}>
                    <Box as="span" fontWeight="bold" mr={2}>
                      {item.version}
                    </Box>
                    <Box as="span" fontWeight="bold">
                      {item.date}
                    </Box>
                    <Box>{item.description}</Box>
                  </ListItem>
                ))}
              </List>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};
