const axios = require('axios');

async function tinyurl(url, alias = '') {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');

        const { headers } = await axios.get('https://cloudflare-cors-anywhere.supershadowcube.workers.dev/?url=https://tinyurl.com/');
        const xsrfToken = headers['set-cookie']?.map(c => c.split(';')[0]).find(c => c.trim().startsWith('XSRF-TOKEN='))?.split('=').slice(1).join('=');
        if (!xsrfToken) throw new Error('Failed to get XSRF token.');
        
        const { data: cf } = await axios.post('https://x1st-cf.hf.space/action', {
            url: 'https://tinyurl.com/',
            siteKey: '0x4AAAAAAAWaftO6M9nMBXRA',
            mode: 'turnstile-min'
        });
        
        if (!cf?.data?.token) throw new Error('Failed to get cf token.');
        
        const { data } = await axios.post('https://cloudflare-cors-anywhere.supershadowcube.workers.dev/?url=https://tinyurl.com/app/api/url/create', {
            url: url,
            alias: alias,
            domain: 'tinyurl.com',
            captcha_token: cf.data.token,
            errors: { errors: {} },
            busy: true,
            successful: false
        }, {
            headers: {
                cookie: headers['set-cookie']?.map(c => c.split(';')[0]).join('; '),
                origin: 'https://tinyurl.com',
                referer: 'https://tinyurl.com/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                'x-requested-with': 'XMLHttpRequest',
                'x-xsrf-token': decodeURIComponent(xsrfToken)
            }
        });
        
        return data.data[0];
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = tinyurl;
