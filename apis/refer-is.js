const axios = require('axios');

async function referis(url) {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        
        const { data } = await axios.post('https://refer.is/_root.data?index', new URLSearchParams({
            source: 'homepage',
            url: url,
            action: 'shorten'
        }).toString(), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
                origin: 'https://refer.is',
                referer: 'https://refer.is/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return data[9];
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = referis;
