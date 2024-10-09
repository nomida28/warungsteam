const { Server } = require("socket.io");

module.exports = (req, res) => {
    if (!res.socket.server.io) {
        console.log("Socket.IO server is initializing...");
        const io = new Server(res.socket.server);

        io.on("connection", (socket) => {
            console.log("User connected");

            // Listen for chat messages
            socket.on("message", (data) => {
                io.emit("message", data);
            });

            // Listen for song requests
            socket.on("songRequest", (data) => {
                io.emit("songRequest", data);
            });

            socket.on("disconnect", () => {
                console.log("User disconnected");
            });
        });

        res.socket.server.io = io;
    } else {
        console.log("Socket.IO server already running");
    }
    res.end();
};
