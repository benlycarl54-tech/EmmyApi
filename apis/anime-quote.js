const axios = require('axios');
const cheerio = require('cheerio');

async function animequote() {
    try {
        const page = Math.floor(Math.random() * 184);
        const { data } = await axios.get('https://otakotaku.com/quote/feed/' + page);
        const $ = cheerio.load(data);
        
        const links = $('div.kotodama-list').map((i, el) => {
            return $(el).find('a.kuroi').attr('href');
        }).get();
        
        const results = await Promise.all(links.map(async (url) => {
            const { data: quote } = await axios.get(url);
            const $q = cheerio.load(quote);
            
            return {
                char: $q('.char-info .tebal a[href*="/character/"]').text().trim(),
                from_anime: $q('.char-info a[href*="/anime/"]').text().trim(),
                episode: $q('.char-info span.meta').text().trim().replace('- ', ''),
                quote: $q('.post-content blockquote p').text().trim()
            };
        }));
        
        return results;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = animequote;
