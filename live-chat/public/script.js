const socket = io();

document.getElementById('enterChat').onclick = () => {
    const username = document.getElementById('username').value;
    if (username) {
        socket.emit('joinUser', username);
        // Redirect to user chat page
    }
};

document.getElementById('enterAdmin').onclick = () => {
    const adminName = document.getElementById('adminName').value;
    if (adminName) {
        socket.emit('joinAdmin', adminName);
        // Redirect to admin chat page
    }
};

socket.on('message', (data) => {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.username}: ${data.message}`;
    messagesDiv.appendChild(messageElement);
});
