const axios = require('axios');

async function scloudsave(url) {
    try {
        if (!/^https?:\/\/(m\.|on\.)?soundcloud\.com\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)?$/.test(url)) throw new Error('Invalid SoundCloud Track URL.');
        
        const { data: cf } = await axios.post('https://x1st-cf.hf.space/action', {
            url: 'https://scloudsave.com/en3',
            siteKey: '0x4AAAAAABo8VyXHqAWxkSEl',
            mode: 'turnstile-min'
        });
        
        if (!cf?.data?.token) throw new Error('Failed to get cf token.');
        
        const inst = axios.create({
            baseURL: 'https://api.scloudsave.com',
            headers: {
                origin: 'https://scloudsave.com',
                referer: 'https://scloudsave.com/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        const { data: t } = await inst.get('/session', {
            headers: {
                'x-turnstile-token': cf.data.token
            }
        });
        
        if (!t?.sessionToken) throw new Error('Failed to get token.');
        inst.defaults.headers.common['x-token'] = t.sessionToken;
        
        const { data: meta } = await inst.get('/track', {
            params: {
                url: url
            }
        });
        
        const { data: aud } = await inst.get('/dl', {
            params: {
                url: meta.trackUrl
            }
        });
        
        return {
            metadata: {
                id: meta.id,
                title: meta.title,
                artists: meta.artists,
                duration: `${String(Math.floor(Math.floor(meta.duration / 1000) / 60)).padStart(2, '0')}:${String(Math.floor(meta.duration / 1000) % 60).padStart(2, '0')}`,
                album: meta.album,
                cover: meta.cover,
                url: url
            },
            audio_url: aud.url
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = scloudsave;
