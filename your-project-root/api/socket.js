import { Server } from "socket.io";

export default function handler(req, res) {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket) => {
            console.log('User connected');

            socket.on('message', (data) => {
                io.emit('message', data); // Kirim ke semua user
            });

            socket.on('songRequest', (data) => {
                io.emit('songRequest', data); // Kirim permintaan lagu ke semua user
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }
    res.end();
}
