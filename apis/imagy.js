const axios = require('axios');

async function imagy(url, { device = 'desktop', full_page = false, device_scale = 1 } = {}) {
    try {
        const devices = {
            desktop: { width: 1920, height: 1080 },
            mobile: { width: 375, height: 812 },
            tablet: { width: 768, height: 1024 }
        };
        
        if (!url.startsWith('https://')) throw new Error('Invalid URL.');
        if (!devices[device]) throw new Error(`Available devices: ${Object.keys(devices).join(', ')}.`);
        if (isNaN(device_scale)) throw new Error('Scale must be a number.');
        if (typeof full_page !== 'boolean') throw new Error('Full page must be a boolean.');
        
        const { data } = await axios.post('https://gcp.imagy.app/screenshot/createscreenshot', {
            url: url,
            browserWidth: devices[device].width,
            browserHeight: devices[device].height,
            fullPage: full_page,
            deviceScaleFactor: parseInt(device_scale),
            format: 'png'
        }, {
            headers: {
                'content-type': 'application/json',
                referer: 'https://imagy.app/full-page-screenshot-taker/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
            }
        });
        
        return data.fileUrl;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = imagy;
