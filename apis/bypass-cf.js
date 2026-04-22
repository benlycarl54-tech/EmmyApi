const axios = require('axios');

async function bypasscf({ url, mode, siteKey } = {}) {
    try {
        if (!url) throw new Error('Url is required.');
        if (!['turnstile-min', 'source', 'waf-session'].includes(mode)) throw new Error('Available modes: turnstile-min, source, waf-session.');
        if (mode === 'turnstile-min' && !siteKey) throw new Error('Sitekey is required for turnstile-min mode.');
        
        const { data } = await axios.post('https://x1st-cf.hf.space/action', {
            url: url,
            mode: mode,
            ...(mode === 'turnstile-min' && { siteKey: siteKey })
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = bypasscf;
