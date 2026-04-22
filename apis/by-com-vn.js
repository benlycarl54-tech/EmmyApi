const axios = require('axios');
const FormData = require('form-data');

async function bycomvn(url) {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        
        const { data: cf } = await axios.post('https://x1st-cf.hf.space/action', {
            url: 'https://by.com.vn/',
            mode: 'waf-session'
        });
        
        if (!cf?.data?.cookies) throw new Error('Failed to get cookies.');
        
        const form = new FormData();
        form.append('url', url);
        const { data } = await axios.post('https://by.com.vn/shorten', form, {
            headers: {
                ...form.getHeaders(),
                cookie: cf.data.cookies.map(c => `${c.name}=${c.value}`).join('; '),
                origin: 'https://by.com.vn',
                referer: 'https://by.com.vn/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                'x-requested-with': 'XMLHttpRequest'
            }
        });
        
        return data.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = bycomvn;
