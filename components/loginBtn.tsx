import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Box, Avatar, Center } from "@chakra-ui/react";

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
          <Center>
            {session.user.name} :Sign out
            <Avatar ml={3} size="sm" src={session.user.image} />
          </Center>
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
