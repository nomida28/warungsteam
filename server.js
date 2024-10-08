const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Menyajikan file statis dari folder 'public'

let songQueue = [];  // Global song queue
let isPlaying = false;

io.on('connection', (socket) => {
    console.log('User connected');

    // Kirim antrian lagu saat user pertama kali terkoneksi
    socket.emit('queueUpdate', songQueue);

    // Saat pesan diterima dari klien
    socket.on('message', (data) => {
        io.emit('message', data); // Kirim pesan kembali ke semua pengguna
    });

    // Saat ada permintaan lagu
    socket.on('songRequest', (data) => {
        songQueue.push(data.song); // Tambahkan lagu ke antrian
        io.emit('queueUpdate', songQueue); // Broadcast antrian lagu terbaru ke semua klien
        if (!isPlaying) {
            playNextSong(io);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

function playNextSong(io) {
    if (songQueue.length > 0) {
        const nextSong = songQueue.shift();  // Ambil lagu dari antrian
        io.emit('playSong', nextSong);  // Kirim perintah ke semua klien untuk memainkan lagu
        isPlaying = true;

        // Simulasikan waktu bermain dengan delay sesuai durasi lagu (sebagai placeholder, durasi 3 menit di sini)
        setTimeout(() => {
            isPlaying = false;
            playNextSong(io);  // Panggil fungsi lagi untuk memainkan lagu berikutnya
        }, 180000);  // 180000ms = 3 menit (atau atur durasi lagu yang sebenarnya)
    } else {
        isPlaying = false;
    }
}

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
