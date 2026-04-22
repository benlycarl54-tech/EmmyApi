const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');

async function saldus(url, alias = '') {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        
        const { data: html, headers } = await axios.get('https://sald.us/');
        const $ = cheerio.load(html);
        const csrf = $('meta[name="csrf-token"]').attr('content');
        if (!csrf) throw new Error('Csrf token not found.');
        
        const { data } = await axios.post('https://sald.us/', {
            smurl: alias,
            url: url
        }, {
            headers: {
                cookie: headers['set-cookie'].join('; '),
                'csrf-token': csrf,
                origin: 'https://sald.us',
                referer: 'https://sald.us/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                'x-csrf-flow-id': crypto.randomUUID()
            }
        });
        
        return `https://sald.us/${data.result.smurl}`;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = saldus;
