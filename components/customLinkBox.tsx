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
  Badge,
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
    const elapsedHours =
      (new Date().getTime() - new Date(this.props.dateTime).getTime()) /
      (1000 * 60 * 60);
    let agoText = "";
    let time_ = new Date().getTime() / (1000 * 60 * 60);
    let timeDiff = elapsedHours / 24;
    let badgeColor = "gray";
    if (timeDiff >= 365) {
      agoText = Math.floor(timeDiff / 365) + " years ago";
      badgeColor = "gray";
    } else if (timeDiff >= 1) {
      agoText = Math.floor(timeDiff) + " days ago";
      badgeColor = "orange";
    } else if (elapsedHours > 1) {
      agoText = Math.floor(elapsedHours) + " hours ago";
      badgeColor = "purple";
    } else if (elapsedHours < 1 && elapsedHours > 0.5) {
      agoText = Math.floor(elapsedHours * 60) + " minutes ago";
      badgeColor = "teal";
    } else {
      agoText = "A moment ago";
      badgeColor = "teal";
    }
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
              <Badge colorScheme={badgeColor}>{agoText}</Badge>
            </Box>
            <Heading size="md" my="2">
              <LinkOverlay href="#">{this.props.ver}</LinkOverlay>
            </Heading>
            <Text mb="3">{this.props.description}</Text>
          </LinkBox>
        </PopoverTrigger>
        <PopoverContent _focus={{ _focus: "none" }}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader borderTopRadius="md">{this.props.ver}</PopoverHeader>
          <PopoverBody>
            ダウンロードファイルを開いてアップロードを実行してください。これはテストです。不具合がある場合は連絡ください。
          </PopoverBody>
          <PopoverFooter>
            <Link href={this.props.linkHref} _focus={{ _focus: "none" }}>
              <Button colorScheme={badgeColor}>
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
