const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

async function ondoku({ text, voice = 'en-US-AdamMultilingualNeural', speed = 1, pitch = 0 } = {}) {
    try {
        if (!text) throw new Error('Text is required.');
        
        const { data: voices } = await axios.get('https://gist.randyyyyy.my.id/raw/ondoku-voices.json');
        if (!voices.includes(voice)) throw new Error(`Available voices: ${voices.join(', ')}.`);
        if (speed < 0.3 || speed > 4) throw new Error('Min speed: 0.3, Max speed: 4.');
        if (pitch < -20 || pitch > 20) throw new Error('Min pitch: -20, Max pitch: 20.');
        
        const { data: rynn, headers } = await axios.post('https://ondoku3.com/en');
        const $ = cheerio.load(rynn);
        
        const token = $('input[name="csrfmiddlewaretoken"]').attr('value');
        if (!token) throw new Error('Token not found.');
        
        const form = new FormData();
        form.append('text', text);
        form.append('voice', voice);
        form.append('speed', speed.toString());
        form.append('pitch', pitch.toString());
        const { data } = await axios.post('https://ondoku3.com/en/text_to_speech/', form, {
            headers: {
                ...form.getHeaders(),
                cookie: headers['set-cookie'].join('; '),
                origin: 'https://ondoku3.com',
                referer: 'https://ondoku3.com/en/',
                'x-csrftoken': token,
                'x-requested-with': 'XMLHttpRequest'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = ondoku;
