const { Server } = require('socket.io');
const { createServer } = require('http');

let io;

module.exports = (req, res) => {
    if (!io) {
        const httpServer = createServer((req, res) => {
            res.writeHead(404);
            res.end();
        });

        io = new Server(httpServer, {
            cors: {
                origin: '*',
            },
        });

        io.on('connection', (socket) => {
            console.log('User connected');

            socket.on('message', (data) => {
                io.emit('message', data);
            });

            socket.on('songRequest', (data) => {
                io.emit('songRequest', data);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });

        httpServer.listen(3000);
    }

    res.end('Socket.IO Server is running');
};
