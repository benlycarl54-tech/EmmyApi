const axios = require('axios');
const cheerio = require('cheerio');

async function unshorten(url) {
    try {
        if (!url.startsWith('https://')) throw new Error('Url is required.');
        
        const { data: html, headers } = await axios.get('https://unshorten.it/');
        const $ = cheerio.load(html);
        
        const token = $('input[name="csrfmiddlewaretoken"]').attr('value');
        if (!token) throw new Error('Failed to get csrf token.');
        
        const { data } = await axios.post('https://unshorten.it/main/get_long_url', new URLSearchParams({
            'short-url': url,
            csrfmiddlewaretoken: token
        }).toString(), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                cookie: headers['set-cookie'].join('; '),
                origin: 'https://unshorten.it',
                referer: 'https://unshorten.it/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                'x-requested-with': 'XMLHttpRequest'
            }
        });
        
        return data.long_url;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = unshorten;
