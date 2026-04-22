const axios = require('axios');
const FormData = require('form-data');

async function imgbb(image) {
    try {
        if (!Buffer.isBuffer(image)) throw new Error('Image must be a buffer.');
        
        const { data: html, headers } = await axios.get('https://imgbb.com/');
        const token = html.match(/auth_token\s*=\s*["']([a-f0-9]+)["']/)?.[1];
        if (!token) throw new Error('Failed to extract auth_token.');
        
        const form = new FormData();
        form.append('source', image, `${Date.now()}_rynn.jpg`);
        form.append('type', 'file');
        form.append('action', 'upload');
        form.append('timestamp', Date.now().toString());
        form.append('auth_token', token);
        const { data } = await axios.post('https://imgbb.com/json', form, {
            headers: {
                ...form.getHeaders(),
                cookie: headers['set-cookie'].join('; '),
                origin: 'https://imgbb.com',
                referer: 'https://imgbb.com/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return data.image.image;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = imgbb;
