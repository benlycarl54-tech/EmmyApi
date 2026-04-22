const axios = require('axios');
const crypto = require('crypto');

async function seekin(url) {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid URL.');
        
        const timestamp = Date.now().toString();
        const key = '3HT8hjE79L';
        const body = { url: url || '' };
        
        const sortedParams = Object.keys(body).sort().map(a => `${a}=${body[a]}`).join('&');
        const signString = `en${timestamp}${key}${sortedParams}`;
        const sign = crypto.createHash('sha256').update(signString).digest('hex');
        
        const { data } = await axios.post('https://api.seekin.ai/ikool/media/download', body, {
            headers: {
                'accept': '*/*',
                'content-type': 'application/json',
                'lang': 'en',
                'origin': 'https://www.seekin.ai',
                'referer': 'https://www.seekin.ai/',
                'sign': sign,
                'timestamp': timestamp,
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return data?.data || data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = seekin;
