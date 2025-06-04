import React from "react";
import { Text } from "@chakra-ui/react";

type Props = {
  content: string;
};

const ExternalLinkText: React.FC<Props> = ({ content }) => {
  const urlRegex = /(http[s]?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);

  return (
    <>
      {parts.map((part, i) =>
        part.match(urlRegex) ? (
          <Text
            as="span"
            key={i}
            color="blue.600"
            textDecoration="underline"
            cursor="pointer"
            onClick={() => window.open(part, "_blank")}
          >
            {part}
          </Text>
        ) : (
          part.split("\n").map((line, j, arr) =>
            j < arr.length - 1 ? (
              <React.Fragment key={j}>
                {line}
                <br />
              </React.Fragment>
            ) : (
              line
            )
          )
        )
      )}
    </>
  );
};

export default ExternalLinkText;
