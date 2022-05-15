import {
  CircularProgress,
  CircularProgressLabel,
  Center,
  Text,
} from "@chakra-ui/react";
import styles from "../styles/home.module.scss";

import React, { useEffect, useState } from "react";

const scrollTop = (): number => {
  return Math.max(
    window.pageYOffset,
    document.documentElement.scrollTop,
    document.body.scrollTop
  );
};

function skillCircle(pops) {
  const [cirValue, setCirValue] = useState<number>(0.01);

  const property = {
    cirText: pops.cirText,
    value: pops.value,
    color: pops.color,
    cir: pops.cir,
    timing: pops.timing,
  };
  const onScroll = (): void => {
    const position = scrollTop();
    // console.log(e.currentTarget.charset);
    if (position >= pops.timing) {
      setCirValue(pops.value);
    } else {
      setCirValue(0.01);
    }
  };

  useEffect(() => {
    document.addEventListener("scroll", onScroll);
    return (): void => document.removeEventListener("scroll", onScroll);
  });

  return (
    <>
      <CircularProgress
        className={styles.cir}
        value={cirValue}
        color={property.color}
        size="180px"
        trackColor="gray.300"
      >
        <CircularProgressLabel fontSize={18}>
          {property.cir}
        </CircularProgressLabel>
        <Center className={styles.cirText} bg={property.color}>
          <Text>{property.cirText}</Text>
        </Center>
      </CircularProgress>
    </>
  );
}

export default skillCircle;
