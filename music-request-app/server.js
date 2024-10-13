const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const YouTube = require('simple-youtube-api');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const youtube = new YouTube('AIzaSyAncxaK5j7GS_9AE1eERrub-F_561F6v0U'); // Ganti dengan API key Anda

let queue = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Seorang pengguna terhubung');

    socket.on('request song', async (songName) => {
        const video = await youtube.searchVideos(songName, 1);
        if (video.length > 0) {
            const videoId = video[0].id; // Dapatkan ID video dari hasil pencarian
            queue.push(`${songName}`); // Menambahkan ke antrean
            io.emit('update queue', queue);
            io.emit('play song', videoId); // Memutar lagu
        } else {
            console.log('Lagu tidak ditemukan');
        }
    });
});

server.listen(4000, () => {
    console.log('Mendengarkan di port 4000');
});
