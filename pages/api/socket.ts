import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) return res.end();

  const io = new Server(res.socket.server, {
    path: "/api/socket_io",
  });

  io.on("connection", (socket) => {
    socket.on("offer", (data) => {
      socket.broadcast.emit("offer", data);
    });

    socket.on("answer", (data) => {
      socket.broadcast.emit("answer", data);
    });

    socket.on("candidate", (data) => {
      socket.broadcast.emit("candidate", data);
    });
  });

  res.socket.server.io = io;
  res.end();
}
