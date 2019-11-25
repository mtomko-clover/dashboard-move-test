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

const bulkInstall = async (postData) => {
    const {sessionId, environment, appId, merchantList} = postData;
    const cookies = `internalSession=${sessionId};`;
    try {
        const installResponse = await axios({
            method: 'post',
            url: `https://${environment.environment}/v3/internal/bulk_install/apps/${appId}`,
            headers: {
                'Content-Type': 'application/json',
                Cookie: `${cookies}`
            },
            data: merchantList,
        });
        return installResponse;
    } catch(err) {
      return false;
    }
};

module.exports = {
    loginInternal,
    bulkInstall
};