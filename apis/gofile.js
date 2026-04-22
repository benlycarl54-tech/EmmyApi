const axios = require('axios');
const FormData = require('form-data');

async function gofile(image) {
    try {
        if (!Buffer.isBuffer(image)) throw new Error('Image must be a buffer.');
        
        const { data: a } = await axios.post('https://api.gofile.io/accounts', {}, {
            headers: {
                origin: 'https://gofile.io',
                referer: 'https://gofile.io/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        if (!a?.data?.token) throw new Error('Failed to create account.');
        
        const { data: b } = await axios.post('https://api.gofile.io/contents/createfolder', {
            parentFolderId: a.data.rootFolder,
            public: true
        }, {
            headers: {
                authorization: `Bearer ${a.data.token}`,
                origin: 'https://gofile.io',
                referer: 'https://gofile.io/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        if (!b?.data?.id) throw new Error('Failed to create folder.');
        
        const form = new FormData();
        form.append('token', a.data.token);
        form.append('folderId', b.data.id);
        form.append('file', image, `${Date.now()}_rynn.jpg`);
        const { data } = await axios.post('https://upload.gofile.io/uploadfile', form, {
            headers: {
                ...form.getHeaders(),
                host: 'upload.gofile.io',
                origin: 'https://gofile.io',
                referer: 'https://gofile.io/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return {
            id: data.data.id,
            filename: data.data.name,
            mimetype: data.data.mimetype,
            size: data.data.size,
            download_page: data.data.downloadPage
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = gofile;
