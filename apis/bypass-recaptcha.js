const axios = require('axios');

async function bypassrecaptcha({ url, siteKey } = {}) {
    try {
        if (!url) throw new Error('Url is required.');
        if (!siteKey) throw new Error('Sitekey is required.');
        
        const { data } = await axios.post('https://rynekoo-recaptcha.hf.space/action', {
            mode: 'v3',
            url: url,
            siteKey: siteKey
        });
        
        if (!data?.data?.token) throw new Error('Failed to get recaptcha token.');
        return data.data.token;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = bypassrecaptcha;
