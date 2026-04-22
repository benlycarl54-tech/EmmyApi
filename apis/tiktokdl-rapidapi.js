const axios = require('axios');

async function tiktokdl(url) {
    try {
        if (!/^https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)\/.+/i.test(url)) throw new Error('Invalid url.');
        
        const { data } = await axios.get('https://tiktok-scraper7.p.rapidapi.com', {
            headers: {
                'accept-encoding': 'gzip',
                'connection': 'Keep-Alive',
                'host': 'tiktok-scraper7.p.rapidapi.com',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
                'x-rapidapi-host': 'tiktok-scraper7.p.rapidapi.com',
                'x-rapidapi-key': 'ca5c6d6fa3mshfcd2b0a0feac6b7p140e57jsn72684628152a'
            },
            params: {
                url: url,
                hd: '1'
            }
        });
        
        return data.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = tiktokdl;
