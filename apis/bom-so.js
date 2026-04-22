const axios = require('axios');

async function bomso(url, alias = '') {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        
        const { headers } = await axios.get('https://cloudflare-cors-anywhere.supershadowcube.workers.dev/?url=https://bom.so/');
        const { data } = await axios.post('https://cloudflare-cors-anywhere.supershadowcube.workers.dev/?url=https://bom.so/shorten', new URLSearchParams({
            url,
            custom: alias,
            expiry: '',
            password: '',
            description: '',
            multiple: '0'
        }).toString(), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                cookie: headers['set-cookie'].join('; '),
                origin: 'https://bom.so',
                referer: 'https://bom.so/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                'x-requested-with': 'XMLHttpRequest'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = bomso;
