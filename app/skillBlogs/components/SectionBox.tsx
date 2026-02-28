import React from "react";
import { Box, Link, Heading, HStack } from "@chakra-ui/react";

interface SectionBoxProps {
  id: string;
  title: string;
  children: React.ReactNode;
  sectionRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  sections: React.MutableRefObject<{ id: string; title: string }[]>;
  size?: string;
  mt?: string;
  rightElement?: React.ReactNode;
}

const SectionBox: React.FC<SectionBoxProps> = ({
  id,
  title,
  children,
  sectionRefs,
  sections,
  size = "md",
  mt = "5",
  rightElement,
}) => {
  return (
    <Box
      id={id}
      ref={(el) => {
        if (el && !sectionRefs.current.includes(el)) {
          sectionRefs.current.push(el);
        }
        if (el && !sections.current.find((s) => s.id === el.id)) {
          sections.current.push({ id: el.id, title });
        }
      }}
      width="100%"
    >
      <HStack justify="space-between" align="center" mt={mt}>
        <Link
          href={`#${id}`}
          style={{ textDecoration: "none" }}
        >
          <Heading size={size} fontWeight="600">
            {title}
          </Heading>
        </Link>
        {rightElement && <Box>{rightElement}</Box>}
      </HStack>
      {children}
    </Box>
  );
};

export default SectionBox;
