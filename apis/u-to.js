const axios = require('axios');

async function uto(url) {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        
        const { data } = await axios.post('https://u.to/api/shorten/', {
            url: url
        }, {
            headers: {
                origin: 'https://u.to',
                referer: 'https://u.to/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = uto;
