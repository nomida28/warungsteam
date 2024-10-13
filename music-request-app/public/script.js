const socket = io();

document.getElementById('requestSong').addEventListener('click', () => {
    const input = document.getElementById('songUrl').value;
    socket.emit('request song', input);
    document.getElementById('songUrl').value = '';
});

socket.on('update queue', (queue) => {
    const queueList = document.getElementById('queue');
    queueList.innerHTML = '';
    queue.forEach((song) => {
        const listItem = document.createElement('li');
        listItem.textContent = song.title; // Tampilkan judul video
        queueList.appendChild(listItem);
    });
});

socket.on('play song', (songUrl) => {
    const audio = document.getElementById('audio');
    audio.src = songUrl; // Anda bisa menyesuaikan ini untuk menggunakan ytdl
    audio.play();
});

document.getElementById('audio').addEventListener('ended', () => {
    socket.emit('song ended');
});

// Menangani error jika video tidak ditemukan
socket.on('error', (message) => {
    alert(message);
});
