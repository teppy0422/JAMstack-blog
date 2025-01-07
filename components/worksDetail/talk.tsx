import { Text } from "@chakra-ui/react";
import styles from "../../styles/home.module.scss";
export default function talk({ say }) {
  return (
    <Text
      className={styles.text}
      paddingLeft={"2em"}
      style={{ textIndent: -2 + "em" }}
      lineHeight={0.5}
      marginY={1}
    >
      {say}
    </Text>
  );
}
