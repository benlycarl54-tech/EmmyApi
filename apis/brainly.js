const axios = require('axios');

async function brainly(query, limit = 50) {
    try {
        if (!query) throw new Error('Query is required.');
        if (isNaN(limit)) throw new Error('Limit must be a number.');
        
        const { data } = await axios.get(`https://cloudflare-cors-anywhere.supershadowcube.workers.dev/?url=${encodeURIComponent(`https://brainly.com/bff/social-qa/answer-experience-web/api/v1/search?query=${encodeURIComponent(query)}&limit=${limit}&market=id`)}`, {
            headers: {
                origin: 'https://brainly.co.id',
                referer: 'https://brainly.co.id/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return data.data.results;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = brainly;
