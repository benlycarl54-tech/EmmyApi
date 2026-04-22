const acrcloud = require('acrcloud');
const fs = require('fs');

async function musicfinder(buffer) {
    try {
        if (!Buffer.isBuffer(buffer)) throw new Error('Music buffer is required.');
        
        const acr = new acrcloud({
            host: 'identify-ap-southeast-1.acrcloud.com',
            access_key: 'af4c28b6e571b8ae17f9fa5e3333a470',
            access_secret: 'IymlQCE9AS7vxGNFBcqZdJs6labIUrsJbg0iQCMR'
        });
        
        const { metadata } = await acr.identify(buffer);
        
        return metadata?.music?.map(a => ({
            title: a.title,
            artists: a.artists.map((a) => a.name),
            score: a.score,
            release: new Date(a.release_date).toLocaleString('en-US').split(',')[0].trim(),
            duration: (() => {
                const m = Math.floor(a.duration_ms / 60000) % 60;
                const s = Math.floor(a.duration_ms / 1000) % 60;
                return [m, s].map(v => v.toString().padStart(2, 0)).join(':');
            })(),
            url: Object.keys(a.external_metadata).map((i) => 
                i === 'youtube' ? 'https://youtu.be/' + a.external_metadata[i].vid : 
                i === 'deezer' ? 'https://www.deezer.com/us/track/' + a.external_metadata[i].track.id : 
                i === 'spotify' ? 'https://open.spotify.com/track/' + a.external_metadata[i].track.id : 
                ''
            )
        }));
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = musicfinder;
