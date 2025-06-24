import { Server as IOServer } from "socket.io";
import { NextRequest } from "next/server";
import { Server as HTTPServer } from "http";
import { Socket as NetSocket } from "net";
import { NextApiResponse } from "next";

// Socket.IO インスタンスを共有するための型拡張
interface SocketWithIO extends NetSocket {
  server: HTTPServer & {
    io?: IOServer;
  };
}
export const config = {
  api: {
    bodyParser: false,
  },
};
export default async function handler(
  req: NextRequest,
  res: NextApiResponse & { socket: SocketWithIO }
) {
  // サーバーに io がなければ作成する
  if (!res.socket.server.io) {
    const io = new IOServer(res.socket.server, {
      path: "/api/socket",
    });
    io.on("connection", (socket) => {
      socket.on("offer", (data) => socket.broadcast.emit("offer", data));
      socket.on("answer", (data) => socket.broadcast.emit("answer", data));
      socket.on("ice-candidate", (data) =>
        socket.broadcast.emit("ice-candidate", data)
      );
    });
    res.socket.server.io = io;
  }
  res.end();
}
