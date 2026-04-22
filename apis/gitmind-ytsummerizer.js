const axios = require('axios');
const { randomBytes } = require('crypto');
const UserAgent = require('user-agents');

async function gitmind(url, { lang = 'id' } = {}) {
    try {
        if (!/youtube\.com|youtu\.be/.test(url)) throw new Error('Invalid youtube url');
        
        const ua = new UserAgent({ deviceCategory: 'mobile' });
        const randomDeviceHash = randomBytes(16).toString('hex');
        const randomOSName = ua.data.platform;
        const randomOSVersion = ua.data.userAgent.match(/OS (\d+)/)?.[1] ?? '14';
        const randomPlatform = [1, 2, 3][Math.floor(Math.random() * 3)];
        
        const { data: a } = await axios.post('https://gw.aoscdn.com/base/passport/v2/login/anonymous', {
            brand_id: 29,
            type: 27,
            platform: randomPlatform,
            cli_os: 'web',
            device_hash: randomDeviceHash,
            os_name: randomOSName,
            os_version: randomOSVersion,
            product_id: 343,
            language: 'en'
        });
        
        const { data: b } = await axios.post('https://gw.aoscdn.com/app/gitmind/v3/utils/youtube-subtitles/overviews?language=en&product_id=343', {
            url: url,
            language: lang,
            deduct_status: 0
        }, {
            headers: {
                authorization: `Bearer ${a.data.api_token}`,
                'content-type': 'application/json'
            }
        });
        
        while (true) {
            const { data } = await axios.get(`https://gw.aoscdn.com/app/gitmind/v3/utils/youtube-subtitles/overviews/${b.data.task_id}?language=en&product_id=343`, {
                headers: {
                    authorization: `Bearer ${a.data.api_token}`,
                    'content-type': 'application/json'
                }
            });
            
            if (data.data.sum_status === 1) return data.data;
            await new Promise(res => setTimeout(res, 1000));
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = gitmind;
