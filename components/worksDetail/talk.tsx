import { Text } from "@chakra-ui/react";
import styles from "../../styles/home.module.scss";
export default function talk({ say }) {
  let num = say.indexOf("「", 0);
  if ((num) => 1) {
    num++;
  }
  return (
    <Text
      className={styles.text}
      paddingLeft={num + "em"}
      style={{ textIndent: -num + "em" }}
    >
      {say}
    </Text>
  );
}
