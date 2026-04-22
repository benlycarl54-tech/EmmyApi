const axios = require('axios');

async function unaimytext({ text, language = 'EN-US' } = {}) {
    try {
        const languages = ['EN-US', 'ES', 'ZH', 'PT-BR', 'NL', 'FI', 'FR', 'DE', 'EL', 'IT', 'PL', 'PT-PT', 'RO', 'RU', 'SK', 'SL', 'SV'];
        
        if (!text) throw new Error('Text is required.');
        if (text.length > 1000) throw new Error('Max text input: 1000 words.');
        if (!languages.includes(language)) throw new Error(`Available languages: ${languages.join(', ')}.`);
        
        const { data: t } = await axios.post('https://api.unaimytext.com/api/v1/humanize/', {
            text: text,
            model: 'basic',
            language: language
        }, {
            headers: {
                origin: 'https://unaimytext.com',
                referer: 'https://unaimytext.com/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        if (!t?.data?.job_id) throw new Error('Failed to create job.');
        while (true) {
            const { data } = await axios.get(`https://api.unaimytext.com/api/v1/humanize/${t.data.job_id}`, {
                headers: {
                    origin: 'https://unaimytext.com',
                    referer: 'https://unaimytext.com/',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
                }
            });
            
            if (data.data.status === 'completed') return data.data;
            await new Promise(res => setTimeout(res, 2000));
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = unaimytext;
