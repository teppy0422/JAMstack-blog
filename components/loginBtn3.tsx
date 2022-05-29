import { Button } from "@chakra-ui/react";
import { login, logout } from "../public/framework/firebase/auth";

type BaseButtonProps = {
  text: string;
  onclick(): void;
};
const BaseButton: React.FC<BaseButtonProps> = (props) => (
  <Button
    backgroundColor="#48BB78"
    color="#fff"
    width="100px"
    height={{ base: "35px", sm: "35px", md: "35px", lg: "35px" }}
    marginRight={2}
    onClick={props.onclick}
  >
    {props.text}
  </Button>
);

const LoginButton = () => <BaseButton onclick={() => login()} text="LOGIN" />;

const LogoutButton = () => (
  <BaseButton onclick={() => logout()} text="LOGOUT" />
);

export { BaseButton, LoginButton, LogoutButton };
