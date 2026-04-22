const axios = require('axios');
const crypto = require('crypto');

async function unlimitedai(question) {
    try {
        if (!question) throw new Error('Question is required.');
        
        const { data } = await axios.post('https://app.unlimitedai.chat/id', [{
            chatId: crypto.randomUUID(),
            messages: [{
                id: crypto.randomUUID(),
                role: 'user',
                content: question,
                parts: [{
                    type: 'text',
                    text: question
                }],
                createdAt: new Date().toISOString()
            }],
            selectedChatModel: 'chat-model-reasoning',
            selectedCharacter: null,
            selectedStory: null,
            turnstileToken: '$undefined',
            deviceId: crypto.randomUUID()
        }], {
            headers: {
                origin: 'https://app.unlimitedai.chat',
                referer: 'https://app.unlimitedai.chat/id',
                'next-action': '40713570958bf1accf30e8d3ddb17e7948e6c379fa',
                'next-router-state-tree': '%5B%22%22%2C%7B%22children%22%3A%5B%5B%22locale%22%2C%22id%22%2C%22d%22%5D%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%2Ctrue%5D',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        const result = data.split('\n').filter(l => /^\w+:\{"diff"/.test(l)).map(l => { try { return JSON.parse(l.slice(l.indexOf(':') + 1)); } catch { return null; } }).filter(o => o?.diff?.[0] === 0 && typeof o.diff[1] === 'string').map(o => o.diff[1]).join('');
        if (!result) throw new Error('No result found.');
        
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = unlimitedai;
