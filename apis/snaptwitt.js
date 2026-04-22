const axios = require('axios');
const cheerio = require('cheerio');

async function snaptwitt(url) {
    try {
        if (!/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+\/status\/\d+/i.test(url)) throw new Error('Invalid Twitter/X URL.');

        const { data: html } = await axios.get('https://snaptwitt.com/');
        const $ = cheerio.load(html);
        
        const token = $('input[name="token"]').attr('value');
        const secToken = html.match(/["']sec_token["']\s*:\s*["']([^"']+)["']/)?.[1] || 'fallback';
        if (!token || !secToken) throw new Error('Token or secToken not found.');
        
        const salt = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const hash = Buffer.from(url).toString('base64') + (url.length + 1000) + Buffer.from(salt).toString('base64') + Buffer.from(secToken).toString('base64');
        
        const { data } = await axios.post('https://snaptwitt.com/wp-json/click-dl/get-data/', new URLSearchParams({
            url,
            token,
            salt,
            hash
        }).toString(), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                origin: 'https://snaptwitt.com',
                referer: 'https://snaptwitt.com/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = snaptwitt;
