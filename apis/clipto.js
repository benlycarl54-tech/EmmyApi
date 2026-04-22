const axios = require('axios');

async function clipto(url) {
    try {
        if (!/youtube.com|youtu.be/.test(url)) throw new Error('Invalid url.');
        
        const { data } = await axios.post('https://www.clipto.com/api/youtube', {
            url: url
        }, {
            headers: {
                'content-type': 'application/json',
                referer: 'https://www.clipto.com/id/media-downloader/youtube-audio-downloader',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = clipto;
