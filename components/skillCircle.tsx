import Image from "next/image";
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
    timing: pops.timing,
    img: pops.img,
  };
  const onScroll = (): void => {
    const position = scrollTop();
    // console.log(property.timing);
    if (position >= pops.timing * 40 + 400) {
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
        size="160px"
        trackColor="gray.300"
      >
        <CircularProgressLabel fontSize={18}>
          <Image
            src={property.img}
            width="72px"
            height="72px"
            alt={property.color}
          />
        </CircularProgressLabel>
        <Center className={styles.cirText} bg={property.color}>
          <Text color="white">{property.cirText}</Text>
        </Center>
      </CircularProgress>
    </>
  );
}

export default skillCircle;
