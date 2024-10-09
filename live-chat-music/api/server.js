const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve static files from the 'public' folder

io.on('connection', (socket) => {
    console.log('User connected');

    // When a message is received from the client
    socket.on('message', (data) => {
        io.emit('message', data); // Broadcast to all users
    });

    // When a song request is made
    socket.on('songRequest', (data) => {
        io.emit('songRequest', data); // Broadcast song request to all users
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
