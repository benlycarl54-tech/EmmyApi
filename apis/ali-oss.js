const axios = require('axios');
const crypto = require('crypto');
const { fromBuffer } = require('file-type');

async function alioss(buffer, fn) {
    try {
        if (!buffer || !Buffer.isBuffer(buffer)) throw new Error('Image buffer is required.');
        
        const { mime, ext } = await fromBuffer(buffer);
        const filename = fn ? fn.includes('.') ? fn : `${fn}.${ext}` : `${Date.now()}.${ext}`;
        
        const { data } = await axios.get('https://visualgpt.io/api/v1/oss/sts-token');
        const { AccessKeyId, AccessKeySecret, SecurityToken } = data.data;
        
        const ossKey = `nekoo/${filename}`;
        const date = new Date().toUTCString();
        const stringToSign = `PUT\n\n${mime}\n${date}\nx-oss-security-token:${SecurityToken}\n/nc-cdn/${ossKey}`;
        const signature = crypto.createHmac('sha1', AccessKeySecret).update(stringToSign).digest('base64');
        const url = `https://nc-cdn.oss-us-west-1.aliyuncs.com/${ossKey}`;
        
        await axios.put(url, buffer, {
            headers: {
                authorization: `OSS ${AccessKeyId}:${signature}`,
                'content-type': mime,
                date: date,
                'x-oss-security-token': SecurityToken
            }
        });
        
        return url;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = alioss;
