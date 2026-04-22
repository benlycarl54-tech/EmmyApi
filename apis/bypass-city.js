const axios = require('axios');

async function bypasscity(url) {
    try {
        if (!url) throw new Error('Url is required.');
        
        const { data: cf } = await axios.post('https://x1st-cf.hf.space/action', {
            url: `https://bypass.city/bypass?bypass=${encodeURIComponent(url)}`,
            mode: 'turnstile-min',
            siteKey: '0x4AAAAAAAGzw6rXeQWJ_y2P'
        });
        
        if (!cf?.data?.token) throw new Error('Failed to get cf token.');
        
        const { data } = await axios.post('https://api2.bypass.city/bypass', {
            url: url
        }, {
            headers: {
                'accept': '*/*',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'content-type': 'application/json',
                'origin': 'https://bypass.city',
                'referer': 'https://bypass.city/',
                'sec-ch-ua': '"Chromium";v="137", "Not(A)Brand";v="24"',
                'sec-ch-ua-mobile': '?1',
                'sec-ch-ua-platform': '"Android"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'token': cf.data.token,
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
                'x-captcha-provider': 'TURNSTILE'
            }
        });
        
        return {
            name: data.name,
            link: data.data
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = bypasscity;
