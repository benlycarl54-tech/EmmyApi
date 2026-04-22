const axios = require('axios');
const cheerio = require('cheerio');

async function anonto(url) {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        
        const { data: html, headers } = await axios.get('https://anon.to/');
        const $ = cheerio.load(html);
        const csrf = $('meta[name="csrf-token"]').attr('content');
        if (!csrf) throw new Error('Csrf token not found.');
        
        const { data } = await axios.post('https://anon.to/livewire-76faba56/update', {
            _token: csrf,
            components: [
                {
                    snapshot: JSON.stringify({
                        data: {
                            url: '',
                            shortUrl: '',
                            captchaToken: 'no-turnstile'
                        },
                        memo: {
                            id: 'ezUv7CFR0Biid4H7DlRS',
                            name: 'pages::home',
                            path: '/',
                            method: 'GET',
                            release: 'a-a-a',
                            children: [],
                            scripts: [],
                            assets: [],
                            errors: [],
                            locale: 'en',
                            islands: []
                        },
                        checksum: 'b9379ce0c2d1a84f64a031a13223a913232cff721d98e0560556957617ecf3c0'
                    }),
                    updates: {
                        url: url
                    },
                    calls: [
                        {
                            method: 'shorten',
                            params: [],
                            metadata: {}
                        }
                    ]
                }
            ]
        }, {
            headers: {
                cookie: headers['set-cookie'].join('; '),
                origin: 'https://anon.to',
                referer: 'https://anon.to/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                'x-livewire': '1'
            }
        });
        
        return JSON.parse(data.components[0].snapshot)?.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = anonto;
