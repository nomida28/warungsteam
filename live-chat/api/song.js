const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_KEY = 'AIzaSyAncxaK5j7GS_9AE1eERrub-F_561F6v0U'; // Ganti dengan API Key mu

router.post('/request', async (req, res) => {
    const { songRequest } = req.body;
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                part: 'snippet',
                q: songRequest,
                key: API_KEY,
                type: 'video'
            }
        });
        res.status(200).json(response.data.items);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data from YouTube API' });
    }
});

module.exports = router;
