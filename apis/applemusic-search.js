const axios = require('axios');
const cheerio = require('cheerio');

async function applemusic(query) {
    try {
        if (!query) throw new Error('Query is required.');
        
        const { data: html } = await axios.get(`https://music.apple.com/us/search?term=${encodeURIComponent(query)}`, {
            headers: {
                'accept-language': 'en-US,en;q=0.9',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(html);
        
        const songs = $('div[aria-label="Songs"]').find('.track-lockup').map((_, element) => {
            const songElement = $(element);
            
            const title = songElement.find('.track-lockup__title a').text().trim();
            const url = songElement.find('.track-lockup__title a').attr('href') || '';
            const explicit = songElement.find('.track-lockup__title [data-testid="explicit-badge"]').length > 0;
            
            const artists = songElement.find('.track-lockup__subtitle a').map((_, artistEl) => 
                $(artistEl).text().trim()
            ).get();
            
            const coverSrcset = songElement.find('picture source[type="image/webp"]').attr('srcset') || '';
            const baseCoverUrl = coverSrcset.split(' ')[0];
            const cover = baseCoverUrl ? baseCoverUrl.replace(/\/\d+x\d+/, '/400x400') : '';
            
            return {
                title,
                artists,
                type: 'Song',
                explicit,
                cover,
                url
            };
        }).get();
        
        return songs;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = applemusic;
