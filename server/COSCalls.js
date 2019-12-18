const axios = require('axios');

const loginInternal = async (postData, env) => {
    try {
        const response = await axios({
            method: 'post',
            url: `https://${env}/cos/v1/dashboard/internal/login`,
            headers: { 'Preferred-Auth': 'internal' },
            data: postData,
            withCredentials: true,
        });
        if (response.headers['set-cookie']) {
            const cookies = response.headers['set-cookie'][0];
            const [internalSessionId] = cookies.split(';');
            return internalSessionId.substring(16, internalSessionId.length);
        }
        return false;

    } catch (err) {
        return err.response.data;
    }
};

module.exports = {
    loginInternal
};