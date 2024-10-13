const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 4000;

app.use(express.static(__dirname));

let musicQueue = [];

// Menangani koneksi socket
io.on('connection', (socket) => {
    console.log('A user connected');

    // Kirim antrean musik ke pengguna baru
    socket.emit('update queue', musicQueue);

    // Menangani permintaan musik
    socket.on('request song', (song) => {
        console.log(`Song requested: ${song}`);
        musicQueue.push(song);
        io.emit('update queue', musicQueue);
    });

    // Menangani pemutaran musik
    socket.on('play next', () => {
        if (musicQueue.length > 0) {
            musicQueue.shift(); // Hapus lagu yang telah diputar
            io.emit('update queue', musicQueue);
        }
    });
});

// Jalankan server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
