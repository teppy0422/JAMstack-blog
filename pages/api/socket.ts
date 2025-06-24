// pages/api/socket.ts

import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { Socket as NetSocket } from "net";
import type { NextApiRequest, NextApiResponse } from "next";

// 拡張型：Socket.IOをサーバーにアタッチするための型
type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
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
