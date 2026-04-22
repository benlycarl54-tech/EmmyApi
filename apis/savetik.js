const axios = require('axios');
const crypto = require('crypto');

async function savetik(url) {
    try {
        if (!/tiktok\.com/.test(url)) throw new Error('Invalid url.');
        
        const k = {
            'enc': 'GJvE5RZIxrl9SuNrAtgsvCfWha3M7NGC',
            'dec': 'H3quWdWoHLX5bZSlyCYAnvDFara25FIu'
        };
        
        const cryptoProc = (type, data) => {
            const key = Buffer.from(k[type]);
            const iv = Buffer.from(k[type].slice(0, 16));
            const cipher = (type === 'enc' ? crypto.createCipheriv : crypto.createDecipheriv)('aes-256-cbc', key, iv);
            let rchipher = cipher.update(data, ...(type === 'enc' ? ['utf8', 'base64'] : ['base64', 'utf8']));
            rchipher += cipher.final(type === 'enc' ? 'base64' : 'utf8');
            return rchipher;
        };
        
        const { data } = await axios.post('https://savetik.app/requests', {
            bdata: cryptoProc('enc', url)
        }, {
            headers: {
                'content-type': 'application/json',
                'user-agent': 'Mozilla/5.0 (Android 16; Mobile; SM-D639N; rv:130.0) Gecko/130.0 Firefox/130.0'
            }
        });
        
        if (!data || data.status !== 'success') throw new Error('Fetch failed.');

        return {
            caption: data.vmtitle,
            author: data.username,
            thumbnail: data.thumbnailUrl,
            video: cryptoProc('dec', data.data),
            audio: data.mp3
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = savetik;
