const axios = require('axios');

async function xgd(url, alias = '') {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        
        const { data: t, headers: h } = await axios.post('https://x.gd/api/V1/auth', {}, {
            headers: {
                origin: 'https://x.gd',
                referer: 'https://x.gd/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        const shift = (t.result.s.split('').find(c => !isNaN(c)) || 0);
        const caesar = (str, n) => str.replace(/[a-zA-Z]/g, c => String.fromCharCode((c.charCodeAt(0) & 96) + (c.charCodeAt(0) - (c.charCodeAt(0) & 96) - 1 - n + 26) % 26 + 1));
        const xacas = Buffer.from(caesar(h['xacas'], +shift).split('').reverse().join(''), 'base64').toString('utf8');
        
        const { data } = await axios.post('https://x.gd/api/V1/shorten', new URLSearchParams({
            url,
            shortid: alias,
            analytics: '1',
            filterbots: '0'
        }).toString(), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                origin: 'https://x.gd',
                referer: 'https://x.gd/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                xacas: xacas
            }
        });
        
        return `https://x.gd/${data.result.xid}`;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = xgd;
