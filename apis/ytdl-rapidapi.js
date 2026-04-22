const axios = require('axios');

async function ytdl(url) {
    try {
        if (!/^https?:\/\//i.test(url)) throw new Error('Invalid url.');
        
        const patterns = [
            /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
            /youtu\.be\/([a-zA-Z0-9_-]{11})/
        ];
        const id = patterns.find(p => p.test(url))?.[Symbol.match](url)?.[1];
        if (!id) throw new Error('Failed to extract link.');
        
        const { data } = await axios.get(`https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${id}`, {
            headers: {
                'x-rapidapi-host': 'ytstream-download-youtube-videos.p.rapidapi.com',
                'x-rapidapi-key': '6fabfe3ba0msha10853256d5c5f9p1c1247jsnf1625ea46cb6'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = ytdl;
