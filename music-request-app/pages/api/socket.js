import { Server } from "socket.io";

let io;

export default function handler(req, res) {
  if (!io) {
    io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected");

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });

      socket.on("request song", (song) => {
        console.log(`Song requested: ${song}`);
        io.emit("song queued", song);
      });
    });
  }
  res.end();
}
