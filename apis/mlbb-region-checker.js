const axios = require('axios');

async function mlbbregioncheck(user_id, zone_id) {
    try {
        if (isNaN(user_id)) throw new Error('Invalid user id input.');
        if (isNaN(zone_id)) throw new Error('Invalid zone id input.');
        
        const { data } = await axios.post('https://uncors.netlify.app/?destination=https://api-gw-prd.vocagame.com/gateway-ms/order/v1/client/transactions/verify', {
            shop_code: 'MOBILE_LEGENDS',
            data: {
                user_id: user_id.toString(),
                zone_id: zone_id.toString()
            }
        }, {
            headers: {
                origin: 'https://vocagame.com',
                referer: 'https://vocagame.com/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                'x-api-key': '4QG09jBHxuS4',
                'x-client': 'web-mobile',
                'x-country': 'ID',
                'x-locale': 'id-id',
                'x-timestamp': Date.now()
            }
        });
        
        return data.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = mlbbregioncheck;
