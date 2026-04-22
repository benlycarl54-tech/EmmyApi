const axios = require('axios');

async function tweeterdownloader(url) {
    try {
        if (!/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+\/status\/\d+/i.test(url)) throw new Error('Invalid Twitter/X URL.');
        
        const { data } = await axios.get(`https://tweeterdownloader.com/wp-json/xvd/v1/extract?url=${encodeURIComponent(url)}`, {
            headers: {
                referer: 'https://tweeterdownloader.com/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = tweeterdownloader;
