const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let songQueue = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('login', (data) => {
    console.log(`${data.username} logged in`);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('song request', (data) => {
    const song = data.songRequest.split('Req ')[1];
    if (songQueue.length < 3) {
      songQueue.push(song);
      io.emit('song queue', songQueue);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
