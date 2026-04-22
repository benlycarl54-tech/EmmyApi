const axios = require('axios');
const FormData = require('form-data');

async function nsfwchecker(image) {
    try {
        if (!Buffer.isBuffer(image)) throw new Error('Image must be a buffer.');
        
        const form = new FormData();
        form.append('file', image, `${Date.now()}_rynn.jpg`);
        const { data } = await axios.post('https://www.nyckel.com/v1/functions/o2f0jzcdyut2qxhu/invoke', form, {
            headers: form.getHeaders()
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = nsfwchecker;
