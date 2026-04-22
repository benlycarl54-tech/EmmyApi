const axios = require('axios');
const cheerio = require('cheerio');

async function thinfi(url) {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        
        const { data: html } = await axios.get('https://thinfi.com/');
        const $ = cheerio.load(html);
        
        const { data: cf } = await axios.post('https://x1st-cf.hf.space/action', {
            url: 'https://thinfi.com/',
            siteKey: '0x4AAAAAACKM1XWBPaH9NJRZ',
            mode: 'turnstile-min'
        });
        
        if (!cf?.data?.token) throw new Error('Failed to get cf token.');
        
        const { data } = await axios.post('https://thinfi.com/url/make', new URLSearchParams({
            mysecret: '',
            nosecret: $('input[name="nosecret"]').attr('value'),
            ts: $('input[name="ts"]').attr('value'),
            url: url,
            password: '',
            'cf-turnstile-response': cf.data.token
        }).toString(), {
            headers: {
                'cache-control': 'max-age=0',
                'content-type': 'application/x-www-form-urlencoded',
                origin: 'https://thinfi.com',
                referer: 'https://thinfi.com/',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        const $r = cheerio.load(data);
        const result = $r('a[title*="Sends you to:"]').attr('href');
        if (!result) throw new Error('No result found.');
        
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = thinfi;
