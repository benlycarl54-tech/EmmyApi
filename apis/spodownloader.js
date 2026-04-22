const axios = require('axios');

async function spodownloader(url, format = 'mp3') {
    try {
        if (!url.includes('open.spotify.com')) throw new Error('Invalid url.');
        if (!['mp3', 'm4a'].includes(format)) throw new Error('Available formats: mp3, m4a.');
        
        const { data: cf } = await axios.post('https://x1st-cf.hf.space/action', {
            url: 'https://spodownloader.com/',
            siteKey: '0x4AAAAAACwvH6E3RfmLvWG2',
            mode: 'turnstile-min'
        });
        
        if (!cf?.data?.token) throw new Error('Failed to get cf token.');
        
        const inst = axios.create({
            baseURL: 'https://media.fabdl.com',
            headers: {
                origin: 'https://spodownloader.com',
                referer: 'https://spodownloader.com/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        const { data: meta } = await inst.get('/spotify/get', {
            headers: {
                'x-cf-token': cf.data.token
            },
            params: {
                url: url
            }
        });
        
        const { data } = await inst.get(format === 'm4a' ? meta.result.m4a_task_url : meta.result.mp3_task_url);
        
        return {
            metadata: {
                id: meta.result.id,
                title: meta.result.name,
                artists: meta.result.artists,
                cover: meta.result.image,
                url: url
            },
            audio_url: 'https://media.fabdl.com' + data.result.download_url
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = spodownloader;
