import React from "react";
import fs from "fs";
import path from "path";

import Ui from "./client";
import { Text } from "@chakra-ui/react";

const Downloads = async () => {
  return (
    <>
      <Text ml={4} className="print-only">
        ※別紙3
      </Text>
      <Ui />
    </>
  );
};
export default Downloads;
