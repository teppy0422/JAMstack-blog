import React from "react";
import {
  LinkBox,
  Box,
  Text,
  Heading,
  LinkOverlay,
  PopoverFooter,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Link,
} from "@chakra-ui/react";
type CustomLinkBoxProps = {
  dateTime: string;
  description: string;
  linkHref: string;
  ver: string;
};
// elapsedHoursを画面に表示する処理を追加
class CustomLinkBox extends React.Component<CustomLinkBoxProps> {
  render() {
    const elapsedHours = Math.floor(
      (new Date().getTime() - new Date(this.props.dateTime).getTime()) /
        (1000 * 60 * 60)
    );
    const daysAgo = `${elapsedHours / 24} days ago`;
    return (
      <Popover>
        <PopoverTrigger>
          <LinkBox
            as="article"
            maxW="sm"
            p="3"
            borderWidth="1px"
            rounded="md"
            borderColor="gray.500"
          >
            <Box as="time" dateTime={this.props.dateTime} fontSize="sm">
              {daysAgo}
            </Box>
            <Heading size="md" my="2">
              <LinkOverlay href="#">{this.props.ver}</LinkOverlay>
            </Heading>
            <Text mb="3">{this.props.description}</Text>
          </LinkBox>
        </PopoverTrigger>
        <PopoverContent _focus={{ _focus: "none" }}>
          <PopoverArrow bg="green.500" />
          <PopoverCloseButton />
          <PopoverHeader bg="green.500" borderTopRadius="md">
            {this.props.ver}
          </PopoverHeader>
          <PopoverBody>
            ダウンロードファイルを開いてアップロードを実行してください。これはテストです。不具合がある場合は連絡ください。
          </PopoverBody>
          <PopoverFooter>
            <Link href={this.props.linkHref} _focus={{ _focus: "none" }}>
              <Button>
                <a download="Sjp3.004.99_.xlsm">Download</a>
              </Button>
            </Link>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    );
  }
}

export default CustomLinkBox;
