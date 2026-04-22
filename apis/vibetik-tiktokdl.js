const axios = require('axios');

async function vibetik(url) {
    try {
        if (!/tiktok\.com/.test(url)) throw new Error('Invalid url.');
        
        const { data } = await axios.get('https://vibetik.net/api/v2/tiktok/info', {
            headers: {
                'user-agent': 'okhttp/4.12.0',
                'x-api-key': 'vtk_m0b1l3_2026_pr0d'
            },
            params: {
                url: url
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = vibetik;
