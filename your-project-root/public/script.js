// Inisialisasi socket
const socket = io();

// Pemain YouTube
let player;
const defaultVideoId = 'BxabNemOlKw'; // Ganti dengan ID video YouTube default

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: defaultVideoId,
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
        // Emit event untuk memutar lagu selanjutnya
        socket.emit('nextSong');
    }
}

// Fitur chat
document.getElementById('send').onclick = function() {
    const message = document.getElementById('message').value;
    socket.emit('chat message', message);
    document.getElementById('message').value = '';
};

// Menerima pesan chat
socket.on('chat message', function(msg) {
    const item = document.createElement('div');
    item.textContent = msg;
    document.getElementById('song-requests').appendChild(item);
});

// Menangani permintaan lagu
socket.on('song request', function(song) {
    const item = document.createElement('div');
    item.textContent = song;
    document.getElementById('song-requests').appendChild(item);
});
