#!/usr/bin/env node
const express = require('express');
const COSCalls = require('./COSCalls');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser({ limit: '10mb' }));

const setCookie = (res, key, id) => {
    res.cookie(key, id, { maxAge: 3600000 });
};

app.post('/login', async (req, res) => {
    console.log("inside app.post", req, res);
    const { username, password, environment } = req.body;
    const data = {
        username, password
    };
    if (username && password) {
        const sessionId = await COSCalls.loginInternal(data, environment.environment);
        if(sessionId instanceof Object){
            console.log(sessionId);
            return res.status(200).send({"error": sessionId.message});
        }
        else if (sessionId) {
            setCookie(res, "sessionId", sessionId);
            return res.status(200).send({"sessionId": sessionId});
        }
    }

    return res.status(400).send('Missing params');
});

app.post('/bulk_install', async (req, res) => {
    const response = await COSCalls.bulkInstall(req.body);
    return res.status(200).send(response.data);
});

app.use(express.static('build/'));
app.listen(3001);
