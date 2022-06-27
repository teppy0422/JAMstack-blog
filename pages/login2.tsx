import React, { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Box } from "@chakra-ui/react";
import Content from "../components/content";

import { Magic } from "magic-sdk";

let magicEmail: any;

const App = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    magicEmail = new Magic("pk_live_6F968428E7D10FDA");
  }, []);

  async function handleLogin() {
    //MagicLinkを使ったログイン
    try {
      console.log(emailRef.current.value);
      await magicEmail.auth.loginWithMagicLink({
        email: emailRef.current.value,
      });
      //リダイレクト
      router.replace("./login");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Content>
      <div className="App">
        <div className="loginForm">
          <div className="loginContents">
            <h2>ログイン</h2>
            <input type="email" placeholder="mail" ref={emailRef} />
            <Button className="loginButton" onClick={() => handleLogin()}>
              ログイン
            </Button>
            <div className="buttons">
              <Button>Twitter</Button>
              <br />
              <div style={{ height: "10px" }} />
              <Button>Github</Button>
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
};

export default App;
