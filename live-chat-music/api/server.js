const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // File statis disajikan dari folder 'public'

io.on('connection', (socket) => {
    console.log('User connected');

    // Saat pesan diterima dari klien
    socket.on('message', (data) => {
        io.emit('message', data); // Kirim kembali ke semua pengguna
    });

    // Saat ada permintaan lagu
    socket.on('songRequest', (data) => {
        io.emit('songRequest', data); // Kirim permintaan lagu ke semua pengguna
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
