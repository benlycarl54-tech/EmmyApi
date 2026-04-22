const axios = require('axios');

async function html2image({ html = '', css = '', width = '720', height = '300', google_fonts = '', ...conf }) {
    try {
        if (!html || typeof html !== 'string') throw new Error('HTML content is required and must be a string.');
        
        const parsedWidth = parseInt(width);
        const parsedHeight = parseInt(height);
        
        if (isNaN(parsedWidth) || parsedWidth <= 0) throw new Error('Width must be a positive number.');
        if (isNaN(parsedHeight) || parsedHeight <= 0) throw new Error('Height must be a positive number.');
        if (parsedWidth > 10000 || parsedHeight > 10000) throw new Error('Width and height must not exceed 10000 pixels.');
        if (css && typeof css !== 'string') throw new Error('CSS must be a string.');
        if (google_fonts && typeof google_fonts !== 'string') throw new Error('Google Fonts must be a string.');
        
        const { headers } = await axios.get('https://htmlcsstoimage.com/', {
            headers: {
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
            }
        });
        
        const { data } = await axios.post('https://htmlcsstoimage.com/image-demo', {
            html,
            css,
            google_fonts,
            full_screen: false,
            viewport_width: parsedWidth,
            viewport_height: parsedHeight,
            render_when_ready: false,
            color_scheme: 'light',
            timezone: 'UTC',
            block_consent_banners: false,
            ...conf
        }, {
            headers: {
                'content-type': 'application/json',
                'cookie': headers['set-cookie'].join('; '),
                'referer': 'https://htmlcsstoimage.com/',
                'requestverificationtoken': 'undefined',
                'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
            },
        });
        
        if (!data || !data.url) throw new Error('Failed to generate image. No URL returned.');
        
        return data.url;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = html2image;
