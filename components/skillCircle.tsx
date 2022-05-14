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
  };
  return (
    <>
      <CircularProgress
        className={styles.cir}
        value={30}
        color="vb"
        size="120px"
        trackColor="gray.300"
      >
        <CircularProgressLabel fontSize={18}>VB.net</CircularProgressLabel>
        <Center className={styles.cirText} bg="vb">
          <Text>{property.cirText}</Text>
        </Center>
      </CircularProgress>
    </>
  );
}

export default skillCircle;
