const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Menyajikan file statis dari folder 'public'

let songQueue = [];  // Menyimpan antrian lagu

io.on('connection', (socket) => {
    console.log('User connected');

    // Mengirimkan antrian lagu ketika ada user baru bergabung
    socket.emit('queueUpdate', songQueue);

    // Saat menerima pesan dari klien
    socket.on('message', (data) => {
        io.emit('message', data); // Mengirim pesan ke semua pengguna
    });

    // Saat ada permintaan lagu
    socket.on('songRequest', (data) => {
        songQueue.push(data.song);
        io.emit('songRequest', data); // Mengirim permintaan lagu ke semua pengguna
        io.emit('queueUpdate', songQueue);  // Update antrian lagu untuk semua pengguna
    });

    // Saat lagu telah selesai diputar, lanjutkan ke lagu berikutnya
    socket.on('nextSong', () => {
        if (songQueue.length > 0) {
            songQueue.shift(); // Hapus lagu yang sudah diputar
            io.emit('queueUpdate', songQueue);  // Update antrian lagu
            if (songQueue.length > 0) {
                io.emit('playNextSong', songQueue[0]); // Mainkan lagu berikutnya
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
