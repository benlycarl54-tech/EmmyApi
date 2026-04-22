const axios = require('axios');
const FormData = require('form-data');

async function densave(url) {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid URL.');
        
        const form = new FormData();
        form.append('url', url);
        form.append('cookie', '');
        const { data } = await axios.post('https://downloaderapi.densavedownloader.app/index.php?action=extract', form, {
            headers: {
                ...form.getHeaders(),
                'cache-control': 'no-cache',
                'referer': 'https://downloaderapi.densavedownloader.app/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
                'x-token': 'yYZykcBmkPRNI5ZIv6hR6gl0fpiC5pT3TSdCx+b2bHreeGWgWUDCtbyLh6UOKEDGqH3ytAC9ZhXA85VOyyCxVQ==',
                'x-appkey': 'hYsnMLnhN7g7TA4lTLngCWC11IfqUDxawxhB0eZYO0WIEXHU9FwwDgT1nPOP5g8L',
                'x-appcode': 'haticitwitter',
                'x-devicedata': '{"platformDeviceId":"1d49e7a631964b6a","appVersion":75,"osVersion":"Android 10","osSdkVersion":"29","deviceModel":"SM-J700F","locale":"id-ID"}'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = densave;
