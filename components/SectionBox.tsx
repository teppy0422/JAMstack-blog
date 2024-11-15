import React from "react";
import { Box, Link, Heading, Divider } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";

interface SectionBoxProps {
  id: string;
  title: string;
  children: React.ReactNode;
  sectionRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  sections: React.MutableRefObject<{ id: string; title: string }[]>;
}

const SectionBox: React.FC<SectionBoxProps> = ({
  id,
  title,
  children,
  sectionRefs,
  sections,
}) => {
  const { colorMode } = useColorMode();
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
    >
      <Link href={`#${id}`} style={{ textDecoration: "none" }}>
        <Heading size="md" fontWeight="600">
          {title}
        </Heading>
      </Link>
      <Divider mt={2} borderColor={colorMode === "light" ? "black" : "white"} />
      {children}
    </Box>
  );
};

export default SectionBox;
