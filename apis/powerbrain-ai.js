const axios = require('axios');

async function powerbrain(question) {
    try {
        if (!question) throw new Error('Question is required.');
        
        const { data } = await axios.post('https://powerbrainai.com/chat.php', {
            message: question,
            messageCount: '1',
        }, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                origin: 'https://powerbrainai.com',
                priority: 'u=0',
                referer: 'https://powerbrainai.com/chat.html',
                te: 'trailers',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return data.response;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = powerbrain;
