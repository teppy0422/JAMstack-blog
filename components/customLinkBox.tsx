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
  Divider,
} from "@chakra-ui/react";
import { TimeIcon } from "@chakra-ui/icons";
type CustomLinkBoxProps = {
  dateTime: string;
  description: string;
  linkHref: string;
  ver: string;
  inCharge: string;
};
// elapsedHoursを画面に表示する処理を追加
class CustomLinkBox extends React.Component<CustomLinkBoxProps> {
  render() {
    const elapsedHours =
      (new Date().getTime() - new Date(this.props.dateTime).getTime()) /
      (1000 * 60 * 60);
    const formattedDateTime = new Date(this.props.dateTime).toLocaleString(
      "ja-JP",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
    const downloadFileName = this.props.linkHref.replace(/^\/files\//, "");
    let inChargeColor = "gray";
    if (this.props.inCharge === "不具合") {
      inChargeColor = "red";
    }
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
            <TimeIcon boxSize={4} paddingRight={1} />
            {formattedDateTime}
            <Divider />
            <Badge colorScheme={inChargeColor}>{this.props.inCharge}</Badge>
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
                <a download={downloadFileName} href={this.props.linkHref}>
                  Download
                </a>
              </Button>
            </Link>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    );
  }
}

export default CustomLinkBox;
