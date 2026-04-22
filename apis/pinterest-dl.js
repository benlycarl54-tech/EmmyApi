const axios = require('axios');

async function pindl(url) {
    try {
        if (!url.includes('pin.it')) throw new Error('Invalid url.');
        
        const { headers } = await axios.get('https://pinterestdownloader.io/');
        const { data } = await axios.get(`https://pinterestdownloader.io/frontendService/DownloaderService?url=${url}`, {
            headers: {
                accept: '*/*',
                cookie: headers['set-cookie'].join('; '),
                referer: 'https://pinterestdownloader.io/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = pindl;
