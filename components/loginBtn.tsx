import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Box } from "@chakra-ui/react";

export default function Component() {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <Button
          colorScheme="blue"
          onClick={() => signOut()}
          id="login"
          style={{ display: "none" }}
        >
          {session.user.name}:Sign out
        </Button>
      ) : (
        <Button
          colorScheme="blue"
          onClick={() => signIn()}
          id="login"
          style={{ display: "none" }}
        >
          Sign in
        </Button>
      )}
    </>
  );
}
