const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

async function saucenao(image) {
    try {
        if (!Buffer.isBuffer(image)) throw new Error('Image must be a buffer.');
        
        const form = new FormData();
        form.append('file', image, `${Date.now()}_rynn.jpg`);
        form.append('url', '');
        const { data } = await axios.post('https://saucenao.com/search.php', form, {
            headers: {
                ...form.getHeaders(),
                origin: 'https://saucenao.com',
                referer: 'https://saucenao.com/',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        const $ = cheerio.load(data);
        const results = [];
        const hidden = [];
        
        $('.result').each((_, el) => {
            const $el = $(el);
            if ($el.attr('id') === 'result-hidden-notification') return;
            
            const similarity = $el.find('.resultsimilarityinfo').text().trim();
            if (!similarity) return;
            
            const isHidden = $el.hasClass('hidden');
            
            const $titleEl = $el.find('.resulttitle').clone();
            $titleEl.find('small, br').remove();
            const title = $titleEl.text().replace(/\s+/g, ' ').trim() || null;
            
            const $img = $el.find('.resultimage img');
            const thumbnail = $img.attr('data-src') || $img.attr('src') || null;
            
            const urls = [];
            $el.find('.resultmiscinfo a[href]').each((_, a) => urls.push($(a).attr('href')));
            
            const entry = {
                title,
                similarity,
                thumbnail,
                urls: urls.length ? urls : []
            };
            
            (isHidden ? hidden : results).push(entry);
        });
        
        return {
            results,
            hidden
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = saucenao;
