const axios = require('axios');

async function jobstreet(job, city) {
    try {
        if (!job) throw new Error('Job is required.');
        if (!city) throw new Error('City is required.');
        
        const { data } = await axios.get('https://jobsearch-api.cloud.seek.com.au/v5/search', {
            params: {
                keywords: job,
                where: city,
                sitekey: 'ID',
                sourcesystem: 'houston',
                pageSize: 10,
                page: 1,
                locale: 'en-US',
            }
        });
        
        return data.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = jobstreet;
