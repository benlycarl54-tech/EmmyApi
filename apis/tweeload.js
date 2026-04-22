const axios = require('axios');

async function tweeload(url) {
    try {
        if (!url || !/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+\/status\/\d+/i.test(url)) throw new Error('Invalid Twitter/X URL.');
        
        const { data } = await axios.get(`https://tweeload.aculix.net/status/?url=${encodeURIComponent(url)}`, {
            headers: {
                authorization: 'cKMQlY4jGCflOStlN3UfnWCxLQSb5GL7UPjPJ3jGS5fkno1Jaf',
                'user-agent': 'okhttp/4.12.0'
            }
        });
        
        return data.tweet || data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = tweeload;
