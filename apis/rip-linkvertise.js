const axios = require('axios');

async function riplinkvertise(url) {
    try {
        if (!/^https?:\/\/(linkvertise\.com\/\d+\/.+|workink\.net\/[A-Za-z0-9]+\/.+|free-content\.pro\/s\?[A-Za-z0-9]+|loot-link\.com\/s\?[A-Za-z0-9]+|lockr\.so\/[A-Za-z0-9]+)/.test(url)) throw new Error('Invalid url.');
        
        const { data: t } = await axios.get('https://trw.lat/api/bypass', {
            headers: {
                origin: 'https://rip.linkvertise.lol',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                'x-api-key': 'TRW_FREE-GAY-15a92945-9b04-4c75-8337-f2a6007281e9'
            },
            params: {
                url: url,
                mode: 'thread'
            }
        });
        
        if (!t?.success) throw new Error('Failed to create task.');
        while (true) {
            const { data } = await axios.get(`https://trw.lat${t.next}`, {
                headers: {
                    origin: 'https://rip.linkvertise.lol',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                    'x-api-key': 'TRW_FREE-GAY-15a92945-9b04-4c75-8337-f2a6007281e9'
                }
            });
            
            if (data.status === 'Done') return data.result;
            await new Promise(res => setTimeout(res, 2000));
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = riplinkvertise;
