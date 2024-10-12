const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ytdl = require('ytdl-core');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));  // Melayani file statis dari folder public

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');  // Melayani halaman utama
});

let songQueue = [];
let currentSong = null;
let userRequests = {};  // Melacak jumlah request setiap user

// Fungsi untuk memutar lagu berikutnya
function playNextSong() {
  if (songQueue.length > 0) {
    currentSong = songQueue.shift();  // Ambil lagu berikutnya dari antrian
    io.emit('playSong', currentSong);  // Kirim instruksi ke client untuk memutar lagu
  } else {
    currentSong = null;
    io.emit('queueEmpty');  // Beritahu client jika antrian kosong
  }
}

// Menangani koneksi user
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Inisialisasi jumlah request user
  if (!userRequests[socket.id]) {
    userRequests[socket.id] = 0;
  }

  // Kirim antrian lagu ke user yang baru terhubung
  socket.emit('songQueueUpdated', songQueue);

  // Menangani request lagu
  socket.on('requestSong', async (url) => {
    if (ytdl.validateURL(url)) {
      if (userRequests[socket.id] < 3) {  // Batasi 3 request per user
        const songInfo = await ytdl.getInfo(url);
        const songData = {
          title: songInfo.videoDetails.title,
          url: url,
          requestedBy: socket.id
        };

        songQueue.push(songData);
        userRequests[socket.id]++;  // Tambahkan hitungan request user
        io.emit('songQueueUpdated', songQueue);

        if (!currentSong) {
          playNextSong();  // Mulai memutar jika tidak ada lagu yang diputar
        }
      } else {
        socket.emit('requestLimitExceeded', 'You have reached the limit of 3 song requests. Please wait until your songs are played.');
      }
    } else {
      socket.emit('invalidUrl', 'Invalid YouTube URL');
    }
  });

  // Menangani event ketika lagu selesai diputar
  socket.on('songFinished', () => {
    if (currentSong) {
      userRequests[currentSong.r
