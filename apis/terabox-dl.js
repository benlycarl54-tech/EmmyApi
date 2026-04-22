const axios = require('axios');

async function teraboxdl(url) {
    try {
        if (!url.includes('terabox') || (url.includes('/s/') && !url.includes('surl'))) throw new Error('Invalid url.');
        
        const { data } = await axios.post('https://teraboxdl.site/api/proxy', {
            url: url
        }, {
            headers: {
                origin: 'https://teraboxdl.site',
                referer: 'https://teraboxdl.site/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = teraboxdl;
