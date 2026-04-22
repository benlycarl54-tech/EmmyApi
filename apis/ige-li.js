const axios = require('axios');
const cheerio = require('cheerio');

async function igeli(url, alias = '') {
    try {
        if (!url.includes('https://')) throw new Error('Invalid url.');
        
        const { data } = await axios.post('https://ige.li/', new URLSearchParams({
            url: url,
            keyword: alias,
            expire: 'clock',
            age: '',
            ageMod: 'day'
        }).toString(), {
            headers: {
                'cache-control': 'max-age=0',
                'content-type': 'application/x-www-form-urlencoded',
                origin: 'https://ige.li',
                referer: 'https://ige.li/',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        const $ = cheerio.load(data);
        const result = $('input.link-input').attr('value');
        if (!result) throw new Error('No result found.');
        
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = igeli;
