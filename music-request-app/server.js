const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { google } = require('googleapis');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const youtube = google.youtube('v3');

// Middleware untuk melayani file statis
app.use(express.static('public'));

// Inisialisasi queue untuk lagu
let queue = [];

io.on('connection', (socket) => {
    socket.on('song request', async (data) => {
        const { title, artist, username } = data;

        // Mencari video di YouTube berdasarkan artist dan title
        const response = await youtube.search.list({
            part: 'snippet',
            q: `${artist} - ${title}`,
            type: 'video',
            key: 'AIzaSyAncxaK5j7GS_9AE1eERrub-F_561F6v0U' // Ganti dengan API key Anda
        });

        if (response.data.items.length > 0) {
            const videoId = response.data.items[0].id.videoId; // Ambil video ID
            const song = {
                title: title,
                artist: artist,
                username: username,
                videoId: videoId // Mengirimkan video ID ke klien
            };
            queue.push(song); // Menambahkan lagu ke queue
            io.emit('song added', song); // Mengirimkan lagu yang ditambahkan ke semua klien
            
            if (queue.length === 1) { // Jika queue sebelumnya kosong, mulai putar lagu pertama
                io.emit('queue updated', queue);
            }
        }
    });

    socket.on('skip song', () => {
        if (queue.length > 0) {
            queue.shift(); // Menghapus lagu yang sedang diputar
            io.emit('queue updated', queue); // Memperbarui queue untuk semua klien
        }
    });
});

// Menggunakan PORT yang sesuai
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
