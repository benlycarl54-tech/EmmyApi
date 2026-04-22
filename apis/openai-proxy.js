const axios = require('axios');

async function openaiproxy({ messages, model = 'gpt-4o-mini', ...args } = {}) {
    try {
        if (!Array.isArray(messages)) throw new Error('Messages must be array.');
        
        const { data } = await axios.post('https://us-central1-chatgpt---android-98259.cloudfunctions.net/openAICompletion', {
            data: {
                messages,
                model,
                ...args
            }
        }, {
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'firebase-instance-id-token': 'dmgbsWiSR1-QDvB9Wm31_z:APA91bGZ_RMLvNlMhA7siQ00k4c7F28LCg77bu1d-9jJp_uowCL9a_g__RyFFXimS0rr93W42ICLXUAVR36zasvQ0A4h_IEj9elJ369QF54_JDtRi_J9R24',
                'user-agent': 'okhttp/3.14.9',
                'x-firebase-appcheck': 'eyJlcnJvciI6IlVOS05PV05fRVJST1IifQ=='
            }
        });
        
        return data.result || data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = openaiproxy;
