const axios = require('axios');
const cheerio = require('cheerio');

async function ai6net(url) {
    try {
        if (!url.includes('https://')) throw new Error('Invalid url.');
        
        const { data } = await axios.post('https://ai6.net/', new URLSearchParams({
            gblshortlink: url,
            gblshortdomain: ''
        }).toString(), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                origin: 'https://ai6.net',
                referer: 'https://ai6.net/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        const $ = cheerio.load(data);
        const result = $('input#GBLInput').attr('value');
        if (!result) throw new Error('No result found.');
        
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = ai6net;
