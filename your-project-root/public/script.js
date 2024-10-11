const socket = io();

// YouTube Player
let player;
const videoId = 'HxkrFFhhgjY'; // Ganti dengan ID video YouTube default

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: videoId,
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        // Emit event to play next song
        socket.emit('nextSong');
    }
}

// Chat Functionality
document.getElementById('send').onclick = function() {
    const message = document.getElementById('message').value;
    socket.emit('chat message', message);
    document.getElementById('message').value = '';
};

socket.on('chat message', function(msg) {
    const item = document.createElement('div');
    item.textContent = msg;
    document.getElementById('song-requests').appendChild(item);
});

// Handle song requests
socket.on('song request', function(song) {
    // Add song request to the list
    const item = document.createElement('div');
    item.textContent = song;
    document.getElementById('song-requests').appendChild(item);
});
