const axios = require('axios');

async function lambdatestvcc(type, num = 10) {
    try {
        const _type = {
            'american-express': 'American Express',
            mastercard: 'MasterCard',
            visa: 'Visa',
            jcb: 'JCB'
        }
        
        if (!Object.keys(_type).includes(type.toLowerCase())) throw new Error(`Available types: ${Object.keys(_type).join(', ')}.`);
        if (isNaN(num)) throw new Error('Invalid number.');
        
        const { data } = await axios.get('https://backend.lambdatest.com/api/dev-tools/credit-card-generator', {
            headers: {
                'content-type': 'application/json'
            },
            params: {
                type: _type[type.toLowerCase()],
                'no-of-cards': num
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message || 'No result found.');
    }
}

module.exports = lambdatestvcc;
