const axios = require('axios');

async function spoome(url, alias = null) {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        
        const { data } = await axios.post('https://spoo.me/api/v1/shorten', {
            ...(alias && { alias: alias }),
            long_url: url
        }, {
            headers: {
                origin: 'https://spoo.me',
                referer: 'https://spoo.me/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = spoome;
