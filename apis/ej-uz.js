const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');

async function ejuz(url, alias = '') {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        
        const { data: html, headers } = await axios.get('https://ej.uz/');
        const $ = cheerio.load(html);
        const csrf = $('meta[name="csrf-token"]').attr('content');
        if (!csrf) throw new Error('Csrf token not found.');
        
        const { data } = await axios.post('https://ej.uz/', {
            smurl: alias,
            url: url
        }, {
            headers: {
                cookie: headers['set-cookie'].join('; '),
                'csrf-token': csrf,
                origin: 'https://ej.uz',
                referer: 'https://ej.uz/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                'x-csrf-flow-id': crypto.randomUUID()
            }
        });
        
        return `https://ej.uz/${data.result.smurl}`;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = ejuz;
