const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve static files from the 'public' directory

io.on('connection', (socket) => {
    console.log('User connected');

    // When a message is received from a client
    socket.on('message', (data) => {
        io.emit('message', data); // Send the message to all clients
    });

    // When a song request is received
    socket.on('songRequest', (data) => {
        io.emit('songRequest', data); // Send the song request to all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});
