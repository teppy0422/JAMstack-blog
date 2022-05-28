import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@chakra-ui/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.name} <br />
        <Button colorScheme="blue" onClick={() => signOut()}>
          Sign out_
        </Button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <Button colorScheme="blue" onClick={() => signIn()}>
        Sign in
      </Button>
    </>
  );
}
