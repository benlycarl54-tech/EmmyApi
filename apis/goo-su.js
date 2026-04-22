const axios = require('axios');
const cheerio = require('cheerio');

async function goosu(url, alias = '') {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        
        const { data: html, headers } = await axios.get('https://goo.su/');
        const $ = cheerio.load(html);
        const csrf = $('meta[name="csrf-token"]').attr('content');
        if (!csrf) throw new Error('Csrf token not found.');
        
        const { data } = await axios.post('https://goo.su/frontend-api/convert', new URLSearchParams({
            url: url,
            alias: alias,
            is_public: '1',
            password: ''
        }).toString(), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                cookie: headers['set-cookie'].join('; '),
                host: 'goo.su',
                origin: 'https://goo.su',
                referer: 'https://goo.su/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                'x-csrf-token': csrf
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = goosu;
