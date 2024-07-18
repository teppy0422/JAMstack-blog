import React from "react";
import { isValidUrl } from "../utils/urlValidator"; // URLのバリデーション関数をインポート

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
  Image,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  TimeIcon,
  TriangleDownIcon,
  TriangleUpIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { LineSegments } from "three";
type CustomLinkBoxProps = {
  dateTime: string;
  description1: string;
  description2: string;
  descriptionIN?: string;
  linkHref: string;
  inCharge: string;
  isLatest: boolean;
};
// elapsedHoursを画面に表示する処理を追加
class CustomLinkBox extends React.Component<CustomLinkBoxProps> {
  render() {
    const versionMatch = this.props.linkHref.match(/Sjp([\d.]+)_/);
    const ver = versionMatch ? versionMatch[1] : "N/A";
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
    const inChargeList = this.props.inCharge
      .split(",")
      .map((item) => item.trim());
    const inChargeColors = inChargeList.map((inCharge) => {
      if (inCharge === "不具合") {
        return { color: "red", variant: "solid" };
      } else if (inCharge.includes("徳島") || inCharge.includes("高知")) {
        return { color: "green", variant: "outline" };
      } else if (inCharge.includes("更新")) {
        return { color: "teal" };
      } else {
        return { color: "gray", variant: "solid" };
      }
    });
    let agoText = "";
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
    const baseUrl = "https://yourdomain.com"; // ここにサイトのベースURLを設定

    return (
      <Popover placement="bottom">
        <PopoverTrigger>
          <LinkBox
            as="article"
            maxW="auto"
            p="2"
            borderWidth="1px"
            rounded="md"
            borderColor="gray.500"
            _hover={{ boxShadow: "dark-lg", cursor: "pointer" }}
          >
            <Box as="time" dateTime={this.props.dateTime} fontSize="sm">
              {this.props.isLatest && (
                <Badge colorScheme="teal" marginRight={2}>
                  Latest
                </Badge>
              )}
              <Badge colorScheme={badgeColor}>{agoText}</Badge>
            </Box>
            <Heading size="md" my="2">
              <LinkOverlay>{ver}</LinkOverlay>
            </Heading>
            <Divider />
            <TimeIcon boxSize={4} paddingRight={1} mt="-0.5" />
            {formattedDateTime}
            <br />
            {inChargeList.map((inCharge, index) => (
              <Badge
                key={index}
                colorScheme={inChargeColors[index].color}
                variant={inChargeColors[index].variant}
                marginRight={1}
              >
                {inCharge}
              </Badge>
            ))}
            {this.props.description1 && (
              <Text mt="2">
                <WarningTwoIcon marginRight="1" color="red.500" mt="-1" />
                {this.props.description1}
              </Text>
            )}
            {this.props.description2 && (
              <Text mt="2">
                <CheckCircleIcon marginRight="1" color="teal.500" mt="-1" />
                {this.props.description2}
              </Text>
            )}
          </LinkBox>
        </PopoverTrigger>
        <PopoverContent
          _focus={{ boxShadow: "none" }}
          style={{ border: "1px solid transparent" }}
        >
          <PopoverArrow bg={this.props.isLatest ? "teal.500" : "red.500"} />
          <PopoverCloseButton color="white" _focus={{ _focus: "none" }} />
          <PopoverHeader
            bg={this.props.isLatest ? "teal.500" : "red.500"}
            roundedTop="md"
          >
            {this.props.isLatest ? (
              <Text color="white" padding={2}>
                最新のバージョンです
              </Text>
            ) : (
              <Text color="white" padding={2}>
                最新のバージョンではありません
              </Text>
            )}
          </PopoverHeader>
          {this.props.descriptionIN && (
            <PopoverBody style={{ border: "none" }}>
              <>
                <Image src={`/files/${ver}.png`} />
                <Text fontSize="sm">{this.props.descriptionIN}</Text>
              </>
            </PopoverBody>
          )}
          {this.props.isLatest && (
            <PopoverFooter>
              <Button colorScheme={badgeColor}>
                <a download={downloadFileName} href={this.props.linkHref}>
                  Download
                </a>
              </Button>
            </PopoverFooter>
          )}
        </PopoverContent>
      </Popover>
    );
  }
}
export default CustomLinkBox;
