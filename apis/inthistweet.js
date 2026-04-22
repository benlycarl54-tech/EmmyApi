const axios = require('axios');

async function inthistweet(url) {
    try {
        if (!/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+\/status\/\d+/i.test(url)) throw new Error('Invalid Twitter/X URL.');
        
        const { data } = await axios.get(`https://inthistweet.app/api/twitter?url=${encodeURIComponent(url)}`, {
            headers: {
                dpr: '1.8',
                referer: `https://inthistweet.app/?q=${url}`,
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                'viewport-width': '400'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = inthistweet;
