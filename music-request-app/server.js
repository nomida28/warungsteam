const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ytdl = require('ytdl-core');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

let songQueue = [];
let currentSong = null;
let userRequests = {};  // Track how many requests each user has made

// Play the next song in the queue
function playNextSong() {
  if (songQueue.length > 0) {
    currentSong = songQueue.shift();  // Get the next song from the queue
    io.emit('playSong', currentSong); // Notify clients to play the song
  } else {
    currentSong = null;
    io.emit('queueEmpty');  // Notify clients that the queue is empty
  }
}

// Handle user connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Initialize user's request count
  if (!userRequests[socket.id]) {
    userRequests[socket.id] = 0;
  }

  // Send the current song queue to the connected user
  socket.emit('songQueueUpdated', songQueue);

  // Handle song request
  socket.on('requestSong', async (url) => {
    if (ytdl.validateURL(url)) {
      if (userRequests[socket.id] < 3) {  // Check if user hasn't exceeded the 3-song limit
        const songInfo = await ytdl.getInfo(url);
        const songData = {
          title: songInfo.videoDetails.title,
          url: url,
          requestedBy: socket.id
        };

        songQueue.push(songData);
        userRequests[socket.id]++;  // Increase the user's request count
        io.emit('songQueueUpdated', songQueue);

        if (!currentSong) {
          playNextSong();  // Autoplay if no song is currently playing
        }
      } else {
        socket.emit('requestLimitExceeded', 'You have reached the request limit of 3 songs. Please wait until your songs are played.');
      }
    } else {
      socket.emit('invalidUrl', 'Invalid YouTube URL');
    }
  });

  // Handle song finished event (sent from the client)
  socket.on('songFinished', () => {
    // Decrease the request count for the user who requested the finished song
    if (currentSong) {
      userRequests[currentSong.requestedBy]--;
    }
    playNextSong();  // Play the next song
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    delete userRequests[socket.id];  // Clean up the user's request count
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
