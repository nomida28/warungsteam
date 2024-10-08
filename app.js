// Mendapatkan elemen yang dibutuhkan
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendBtn');
const player = document.getElementById('player');
const queueList = document.getElementById('queueList');

let musicQueue = []; // Antrian musik

// Fungsi untuk menambahkan pesan ke chat
function addMessage(sender, message) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(p);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll ke bawah
}

// Fungsi untuk menambahkan lagu ke antrian
function addToQueue(videoId, title) {
    musicQueue.push({ videoId, title }); // Menambahkan lagu ke antrian
    updateQueueDisplay(); // Memperbarui tampilan antrian
}

// Fungsi untuk memperbarui tampilan antrian
function updateQueueDisplay() {
    queueList.innerHTML = ''; // Mengosongkan tampilan antrian
    musicQueue.forEach((song, index) => {
        const p = document.createElement('p');
        p.innerText = `${index + 1}. ${song.title}`; // Menampilkan judul lagu dengan nomor
        queueList.appendChild(p);
    });
}

// Fungsi untuk memproses request lagu
function handleSongRequest(message) {
    if (message.toLowerCase().startsWith('req')) {
        const request = message.slice(3).trim();
        const [artist, title] = request.split('-').map(part => part.trim());
        if (artist && title) {
            const songQuery = `${artist} ${title}`;
            searchYouTube(songQuery); // Cari lagu di YouTube
        } else {
            addMessage('Bot', 'Format tidak valid. Silakan gunakan "req artist-title".');
        }
    }
}

// Fungsi untuk mencari video di YouTube menggunakan API YouTube
function searchYouTube(query) {
    const apiKey = 'AIzaSyAncxaK5j7GS_9AE1eERrub-F_561F6v0U'; // Ganti dengan YouTube API Key Anda
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length > 0) {
                const videoId = data.items[0].id.videoId; // Mendapatkan ID video pertama dari hasil pencarian
                const videoTitle = data.items[0].snippet.title;
                addMessage('Bot', `Added to queue: ${videoTitle}`);
                addToQueue(videoId, videoTitle); // Menambahkan video ke antrian
                if (musicQueue.length === 1) { // Jika ini lagu pertama, langsung putar
                    playVideo(videoId);
                }
            } else {
                addMessage('Bot', `Tidak ada hasil yang ditemukan untuk "${query}".`);
            }
        })
        .catch(error => {
            console.error('Error searching YouTube:', error);
            addMessage('Bot', 'Terjadi kesalahan saat mencari lagu.');
        });
}

// Fungsi untuk memutar video di embed YouTube
function playVideo(videoId) {
    const newSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1`; // URL video dengan autoplay
    player.src = newSrc; // Mengubah src iframe untuk memutar video baru
}

// Event listener untuk mengirim pesan
sendBtn.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        addMessage('You', message); // Menambahkan pesan pengguna ke chat
        handleSongRequest(message); // Memproses permintaan lagu jika sesuai
        chatInput.value = ''; // Mengosongkan kolom input setelah mengirim
    }
});

// Event listener untuk mendeteksi ketika video selesai diputar
player.addEventListener('load', () => {
    // Mengatur interval untuk memeriksa video yang sedang diputar
    setInterval(() => {
        if (musicQueue.length > 0) {
            const currentVideoId = player.src.split('/').pop().split('?')[0];
            // Jika video saat ini sudah selesai, putar video berikutnya di antrian
            if (currentVideoId === musicQueue[0].videoId) {
                musicQueue.shift(); // Menghapus video yang sudah diputar
                updateQueueDisplay(); // Memperbarui tampilan antrian
                if (musicQueue.length > 0) {
                    const nextVideoId = musicQueue[0].videoId;
                    playVideo(nextVideoId); // Memutar video berikutnya
                }
            }
        }
    }, 5000); // Cek setiap 5 detik
});






//AIzaSyAncxaK5j7GS_9AE1eERrub-F_561F6v0U
