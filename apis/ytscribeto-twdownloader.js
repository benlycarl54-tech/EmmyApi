const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

async function ytscribeto(url) {
    try {
        if (!/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+\/status\/\d+/i.test(url)) throw new Error('Invalid Twitter/X URL.');
        
        const { data: html } = await axios.get('https://ytscribeto.com/pl/twdownloader/');
        const $ = cheerio.load(html);
        
        const form = new FormData();
        form.append('post_id', $('input[name="post_id"]').attr('value'));
        form.append('form_id', $('input[name="form_id"]').attr('value'));
        form.append('referer_title', $('input[name="referer_title"]').attr('value'));
        form.append('queried_id', $('input[name="queried_id"]').attr('value'));
        form.append('form_fields[url]', url);
        form.append('trp-form-language', 'pl');
        form.append('action', 'elementor_pro_forms_send_form');
        form.append('referrer', 'https://ytscribeto.com/pl/twdownloader/');
        const { data } = await axios.post('https://ytscribeto.com/wp-admin/admin-ajax.php', form, {
            headers: {
                ...form.getHeaders(),
                origin: 'https://ytscribeto.com',
                referer: 'https://ytscribeto.com/pl/twdownloader/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36',
                'x-requested-with': 'XMLHttpRequest'
            }
        });
        
        if (!data?.success || !data?.data?.data?.result) throw new Error('No result found.');
        return data.data.data.result;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = ytscribeto;
