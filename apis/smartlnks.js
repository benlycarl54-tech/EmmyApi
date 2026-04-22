const axios = require('axios');
const crypto = require('crypto');

async function smartlnks({ url, alias, domain = 'smartlnks.com' } = {}) {
    try {
        const domains = ['smartlnks.com', 'appopen.link', 'linkopener.in'];
        
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        if (!domains.includes(domain)) throw new Error(`Available domains: ${domains.join(', ')}.`);
        if (!alias) alias = crypto.randomBytes(6).reduce((a, b) => a + 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[b % 62], '');
        
        const { data } = await axios.post('https://api.smartlnks.co/v1/link/create/', {
            title: '',
            destination_url: url,
            alias: alias,
            prefix: '',
            postfix: '',
            domain: domain,
            tab: 'smartlnks',
            password_data: {
                password: ''
            },
            schedule_it_data: {
                dateTimeRangeField: []
            }
        }, {
            headers: {
                authorization: 'Token',
                origin: 'https://smartlnks.com',
                referer: 'https://smartlnks.com/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = smartlnks;
