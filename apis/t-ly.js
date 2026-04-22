const axios = require('axios');
const cheerio = require('cheerio');

async function tly(url) {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        
        const { data: html } = await axios.get('https://cloudflare-cors-anywhere.supershadowcube.workers.dev/?url=https://t.ly/');
        const $ = cheerio.load(html);
        const csrf = $('meta[name="csrf-token"]').attr('content');
        if (!csrf) throw new Error('Csrf token not found.');
        
        const { data: cf } = await axios.post('https://x1st-cf.hf.space/action', {
            url: 'https://t.ly/',
            siteKey: '0x4AAAAAAA6204adXJ46odtd',
            mode: 'turnstile-min'
        });
        
        if (!cf?.data?.token) throw new Error('Failed to get cf token.');
        
        const { data } = await axios.post('https://api.t.ly/api/v1/link/shorten', {
            domain: 'https://t.ly/',
            long_url: url,
            recaptcha_verify: cf.data.token
        }, {
            headers: {
                origin: 'https://t.ly',
                referer: 'https://t.ly/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                'x-csrf-token': csrf,
                'x-requested-with': 'XMLHttpRequest'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = tly;
