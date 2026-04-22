const axios = require('axios');

async function oneshpl(url) {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        
        const { data: cf } = await axios.post('https://x1st-cf.hf.space/action', {
            url: 'https://www.1sh.pl/',
            siteKey: '0x4AAAAAABepk57SHCgzF8PM',
            mode: 'turnstile-min'
        });
        
        if (!cf?.data?.token) throw new Error('Failed to get cf token.');
        
        const { data } = await axios.post('https://www.1sh.pl/api/v1/link', {
            url: url,
            turnstileToken: cf.data.token
        }, {
            headers: {
                origin: 'https://www.1sh.pl',
                referer: 'https://www.1sh.pl/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return `https://1sh.pl/${data.id}`;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = oneshpl;
