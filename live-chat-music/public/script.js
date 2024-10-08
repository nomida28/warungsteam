const socket = io();
let username = '';
let songQueue = [];

// Inisialisasi YouTube Player API
let player;
let currentSong = '';

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
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
        playNextSong();
    }
}

function playNextSong() {
    if (songQueue.length > 0) {
        const songTitle = songQueue.shift();
        searchYouTubeAndPlay(songTitle);
        updateQueue();
    }
}

function searchYouTubeAndPlay(songTitle) {
    const apiKey = 'AIzaSyAncxaK5j7GS_9AE1eERrub-F_561F6v0U';
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(songTitle)}&key=${apiKey}`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            const videoId = data.items[0].id.videoId;
            player.loadVideoById(videoId);
            player.playVideo();
        })
        .catch(error => console.error('Error fetching YouTube video:', error));
}

// Fungsi untuk memulai chat
document.getElementById('enterChat').addEventListener('click', () => {
    const nameInput = document.getElementById('username').value;
    if (nameInput.trim() !== '') {
        username = nameInput;
        document.getElementById('name-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
    } else {
        alert('Please enter a valid name');
    }
});

// Fungsi untuk mengirim pesan
document.getElementById('sendMessage').addEventListener('click', () => {
    sendMessage();
});

document.getElementById('inputMessage').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
        event.preventDefault();
    }
});

function sendMessage() {
    const msg = document.getElementById('inputMessage').value;
    if (msg.trim() !== '') {
        if (msg.startsWith('req ')) {
            const songRequest = msg.slice(4);
            songQueue.push(songRequest);
            socket.emit('songRequest', { name: username, song: songRequest });
        } else {
            socket.emit('message', { name: username, message: msg });
        }
        document.getElementById('inputMessage').value = '';
    }
}

function updateQueue() {
    const queueList = document.getElementById('queueList');
    queueList.innerHTML = '';
    songQueue.forEach((song, index) => {
        const songDiv = document.createElement('div');
        songDiv.textContent = `${index + 1}. ${song}`;
        queueList.appendChild(songDiv);
    });
}

socket.on('message', (data) => {
    const div = document.createElement('div');
    div.innerHTML = `${data.name}: ${data.message}`;
    document.getElementById('messages').appendChild(div);
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});

socket.on('songRequest', (data) => {
    const queueList = document.getElementById('queueList');
    const songDiv = document.createElement('div');
    songDiv.className = 'song-request';
    songDiv.innerHTML = `Request dari ${data.name}: <strong>${data.song}</strong>`;
    queueList.appendChild(songDiv);

    if (songQueue.length === 1) {
        playNextSong();
    }
});

socket.on('queueUpdate', (queue) => {
    songQueue = queue;
    updateQueue();
});
