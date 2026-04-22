const axios = require('axios');
const cheerio = require('cheerio');

async function isgd(url, alias = '') {
    try {
        if (!url.includes('https://')) throw new Error('Invalid url.');
        
        const { data } = await axios.post('https://uncors.netlify.app/?destination=https://is.gd/create.php', new URLSearchParams({
            url: url,
            shorturl: alias,
            opt: 0
        }).toString(), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                origin: 'https://is.gd',
                referer: 'https://is.gd/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        const $ = cheerio.load(data);
        const result = $('input#short_url').attr('value');
        if (!result) throw new Error('No result found.');
        
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = isgd;
