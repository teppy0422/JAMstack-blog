// app/game/page.tsx
import dynamic from "next/dynamic";

const GameClient = dynamic(() => import("./client"), { ssr: false });

export default function GamePage() {
  return <GameClient />;
}
