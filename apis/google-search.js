const axios = require('axios');

async function googlesearch({ q, start = 1, hl = 'en', safe = 'off', ...options } = {}) {
    try {
        if (!q) throw new Error('Query is required.');
        
        const { data } = await axios.get('https://goosh.org/q.php', {
            headers: {
                referer: 'https://goosh.org/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            },
            params: {
                q: q,
                start: start,
                hl: hl,
                safe: safe,
                rsz: 'large',
                ...options
            }
        });
        
        const cleaned = data.trim().replace(/^\(,/, '').replace(/\);$/, '');
        const parsed = JSON.parse(cleaned);
        
        return (parsed?.items ?? []).map((item, i) => ({
            id: i + 1,
            title: item.title ?? null,
            description: item.pagemap?.metatags?.[0]?.['og:description'] ?? null,
            snippet: item.snippet ?? null,
            favicon: item.displayLink ? `https://www.google.com/s2/favicons?domain=${item.displayLink}&sz=64` : null,
            domain: item.displayLink ?? null,
            url: item.link ?? null
        }));
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = googlesearch;
