const axios = require('axios');
const FormData = require('form-data');
const ua = require('user-agents');

async function tracemoe(image) {
    try {
        if (!Buffer.isBuffer(image)) throw new Error('Image must be a buffer.');
        
        const form = new FormData();
        form.append('image', image, `${Date.now()}_rynn.jpg`);
        const { data } = await axios.post('https://api.trace.moe/search', form, {
            headers: {
                ...form.getHeaders(),
                origin: 'https://trace.moe',
                'user-agent': new ua().toString()
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = tracemoe;
