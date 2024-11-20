import React from "react";
import { Box, Link, Heading, Divider } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";

interface SectionBoxProps {
  id: string;
  title: string;
  children: React.ReactNode;
  sectionRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  sections: React.MutableRefObject<{ id: string; title: string }[]>;
  size?: string;
}

const SectionBox: React.FC<SectionBoxProps> = ({
  id,
  title,
  children,
  sectionRefs,
  sections,
  size = "md",
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
      width="100%"
    >
      <Link
        href={`#${id}`}
        style={{ textDecoration: "none", display: "inline-block" }} // displayをinline-blockに設定
      >
        <Heading size={size} fontWeight="600" mt={5}>
          {title}
        </Heading>
      </Link>
      {children}
    </Box>
  );
};

export default SectionBox;
