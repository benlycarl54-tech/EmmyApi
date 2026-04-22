const axios = require('axios');

async function tokviewer({ username, limit = 10 } = {}) {
    try {
        if (!username) throw new Error('Username is required.');
        if (isNaN(limit)) throw new Error('Limit must be a number.');
        
        const [{ data: profile }, { data: posts }] = await Promise.all([
            axios.post('https://tokviewer.net/api/check-profile', {
                username: username
            }, {
                headers: {
                    origin: 'https://tokviewer.net',
                    referer: 'https://tokviewer.net/'
                }
            }),
            axios.post('https://tokviewer.net/api/video', {
                username: username,
                offset: 0,
                limit: limit
            }, {
                headers: {
                    origin: 'https://tokviewer.net',
                    referer: 'https://tokviewer.net/'
                }
            })
        ]);
        
        const { data: reposts } = await axios.post('https://tokviewer.net/api/repost', {
            sec_uid: profile.data.sec_uid,
            offset: 0,
            limit: limit
        }, {
            headers: {
                origin: 'https://tokviewer.net',
                referer: 'https://tokviewer.net/tiktok-repost-viewer'
            }
        })
        
        return {
            profile_info: {
                username: username,
                ...profile.data
            },
            posts: posts.data,
            reposts: reposts.data
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = tokviewer;
