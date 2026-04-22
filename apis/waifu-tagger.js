const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function waifutagger(buffer, options = {}) {
    try {
        const api_url = 'https://smilingwolf-wd-tagger.hf.space/gradio_api';
        const models = ['deepghs/idolsankaku-eva02-large-tagger-v1', 'deepghs/idolsankaku-swinv2-tagger-v1', 'SmilingWolf/wd-convnext-tagger-v3', 'SmilingWolf/wd-eva02-large-tagger-v3', 'SmilingWolf/wd-swinv2-tagger-v3', 'SmilingWolf/wd-v1-4-convnext-tagger-v2', 'SmilingWolf/wd-v1-4-convnextv2-tagger-v2', 'SmilingWolf/wd-v1-4-moat-tagger-v2', 'SmilingWolf/wd-v1-4-swinv2-tagger-v2', 'SmilingWolf/wd-v1-4-vit-tagger-v2', 'SmilingWolf/wd-vit-large-tagger-v3', 'SmilingWolf/wd-vit-tagger-v3'];
        const {
            model = 'SmilingWolf/wd-swinv2-tagger-v3',
            general_tags_threshold = 0.35,
            general_mcut_threshold = false,
            char_tags_threshold = 0.85,
            char_mcut_threshold = false
        } = options;

        if (!Buffer.isBuffer(buffer)) throw new Error('Image buffer is required.');
        if (!models.includes(model)) throw new Error(`Available models: ${models.join(', ')}.`);
        if (general_tags_threshold > 1 || char_tags_threshold > 1) throw new Error('Max tags threshold: 1.');
        if (typeof general_mcut_threshold !== 'boolean' || typeof char_mcut_threshold !== 'boolean') throw new Error('Mcut threshold must be boolean.');

        const form = new FormData();
        form.append('files', buffer, `rynn_${Date.now()}.jpg`);
        const upload = await axios.post(`${api_url}/upload?upload_id=${Math.random().toString(36).substring(2)}`, form, { headers: { ...form.getHeaders() } });
        const session_hash = Math.random().toString(36).substring(2);

        await axios.post(`${api_url}/queue/join?`, {
            data: [{
                path: upload.data[0],
                url: `https://smilingwolf-wd-tagger.hf.space/gradio_api/file=${upload.data[0]}`,
                orig_name: `rynn_${Date.now()}.jpg`,
                size: buffer.length,
                mime_type: 'image/jpeg',
                meta: { _type: 'gradio.FileData' }
            }, model, general_tags_threshold, general_mcut_threshold, char_tags_threshold, char_mcut_threshold],
            event_data: null,
            fn_index: 2,
            trigger_id: 18,
            session_hash
        });

        const { data } = await axios.get(`${api_url}/queue/data?session_hash=${session_hash}`);
        let result;
        for (const line of data.split('\n\n')) {
            if (line.startsWith('data:')) {
                const d = JSON.parse(line.substring(6));
                if (d.msg === 'process_completed') result = d.output.data;
            }
        }

        return {
            character: {
                name: result[2]?.label,
                confidences: result[2]?.confidences
            },
            rating: result[1].confidences,
            prompt: result[0],
            tags: {
                name: result[3].label,
                confidences: result[3].confidences
            }
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = waifutagger;
