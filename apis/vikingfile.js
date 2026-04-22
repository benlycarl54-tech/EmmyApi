const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');

async function vikingfile(image) {
    try {
        if (!Buffer.isBuffer(image)) throw new Error('Image must be a buffer.');
        
        const inst = axios.create({
            baseURL: 'https://vikingfile.com/api',
            headers: {
                origin: 'https://vikingfile.com',
                referer: 'https://vikingfile.com/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        const form = new FormData();
        form.append('size', image.length);
        const { data: up } = await inst.post('/get-upload-url', form, {
            headers: form.getHeaders()
        });
        
        const { headers } = await axios.put(up.urls[0], image, {
            headers: {
                'content-type': 'image/jpeg'
            }
        });
        
        const formr = new FormData();
        formr.append('name', `${Date.now()}_rynn.jpg`);
        formr.append('user', '');
        formr.append('uploadId', up.uploadId);
        formr.append('key', up.key);
        formr.append('parts[0][PartNumber]', up.numberParts);
        formr.append('parts[0][ETag]', headers['etag']);
        const { data: b } = await inst.post('/complete-upload', formr, {
            headers: formr.getHeaders()
        });
        
        const { data: cf } = await axios.post('https://x1st-cf.hf.space/action', {
            url: `https://vik1ngfile.site/f/${b.hash}`,
            siteKey: '0x4AAAAAAAgbsMNBuk2d3Qp6',
            mode: 'turnstile-min'
        });
        
        if (!cf?.data?.token) throw new Error('Failed to get cf token.');
        
        const { data } = await axios.post(`https://vik1ngfile.site/f/${b.hash}`, new URLSearchParams({
            'cf-turnstile-response': cf.data.token,
            'ipv4': [10, crypto.randomInt(256), crypto.randomInt(256), crypto.randomInt(256)].join('.'),
            'ipv6': ''
        }).toString(), {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                origin: 'https://vik1ngfile.site',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = vikingfile;
