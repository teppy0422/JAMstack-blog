import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Box } from "@chakra-ui/react";

export default function Component() {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <Button colorScheme="blue" onClick={() => signOut()}>
          Sign out_ {session.user.name}
        </Button>
      ) : (
        <Button colorScheme="blue" onClick={() => signIn()}>
          Sign in
        </Button>
      )}
    </>
  );
}
