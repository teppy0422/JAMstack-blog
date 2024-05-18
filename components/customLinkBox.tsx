import React from "react";
import { LinkBox, Box, Text, Heading, LinkOverlay } from "@chakra-ui/react";

type CustomLinkBoxProps = {
  dateTime: string;
  daysAgo: string;
  heading: string;
  description: string;
  linkHref: string;
  linkText: string;
};

class CustomLinkBox extends React.Component<CustomLinkBoxProps> {
  render() {
    return (
      <LinkBox
        as="article"
        maxW="sm"
        p="5"
        borderWidth="1px"
        rounded="md"
        borderColor="gray.500"
      >
        <Box as="time" dateTime={this.props.dateTime}>
          {this.props.daysAgo}
        </Box>
        <Heading size="md" my="2">
          <LinkOverlay href="#">{this.props.heading}</LinkOverlay>
        </Heading>
        <Text mb="3">{this.props.description}</Text>
        <Box
          as="a"
          color="teal.400"
          href={this.props.linkHref}
          fontWeight="bold"
        >
          {this.props.linkText}
        </Box>
      </LinkBox>
    );
  }
}

export default CustomLinkBox;
