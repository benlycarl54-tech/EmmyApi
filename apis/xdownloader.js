const axios = require('axios');

async function xdownloader(url) {
    try {
        const id = url.match(/(?:twitter\.com|x\.com)\/.+\/status\/(\d+)/i)?.[1];
        if (!id) throw new Error('Invalid Twitter/X URL.');
        
        const { data } = await axios.get(`https://api.xdownloader.com/twitter/tweet/media?id=${id}`, {
            headers: {
                referer: 'https://xdownloader.com',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = xdownloader;
