import {
  CircularProgress,
  CircularProgressLabel,
  Center,
  Text,
} from "@chakra-ui/react";
import styles from "../styles/home.module.scss";

function skillCircle(pops) {
  const property = {
    cirText: pops.cirText,
    value: pops.value,
    color: pops.color,
    cir: pops.cir,
  };
  return (
    <>
      <CircularProgress
        className={styles.cir}
        value={property.value}
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
