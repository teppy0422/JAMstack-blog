// app/welcome/page.tsx
import dynamic from "next/dynamic";

const WelcomeClient = dynamic(() => import("./WelcomeClient"), { ssr: false });

export default function WelcomePage() {
  return <WelcomeClient />;
}
