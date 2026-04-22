const axios = require('axios');

async function ssvid(url) {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid URL.');
        
        const { data } = await axios.post('https://ssvid.net/api/ajax/search?hl=en', new URLSearchParams({
            query: url,
            cf_token: '',
            vt: 'home'
        }).toString(), {
            headers: {
                accept: '*/*',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                origin: 'https://ssvid.net',
                referer: 'https://ssvid.net/en-3',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
                'x-requested-with': 'XMLHttpRequest'
            }
        });
        
        return data?.data || data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = ssvid;
