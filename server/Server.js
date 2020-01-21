#!/usr/bin/env node
const express = require('express');
const COSCalls = require('./COSCalls');
const bodyParser = require('body-parser');
const cmd = require('node-cmd');
const axios = require('axios');


const app = express();
app.use(bodyParser({ limit: '10mb' }));

const setCookie = (res, key, id) => {
    res.cookie(key, id, { maxAge: 3600000 });
};

app.post('/login', async (req, res) => {
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

app.post('/app_by_id', async (req, res) => {
    const { app_id } = req.body;
    let command = '10.133.32.156:2049/app/' + app_id;
    try {
        const installResponse = await axios({
            method: 'get',
            url: command,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return installResponse;
    } catch(err) {
        return false;
    }
    // const response = await axios({
    //     method: 'get',
    //     url: command,
    //     headers: { 'App By Id': 'internal' },
    //     withCredentials: true,
    // });

    // console.log("inside app.post", req, res);
    // let command = 'curl 10.133.32.156:2049/app/' + app_id;
    // console.log(command);
    // cmd.get(
    //     'curl 10.133.32.156:2049/app/0YYDJSPRXWRSM',
    //     function(err, data, stderr){
    //         console.log('data', data);
    //         console.log('err', err);
    //         console.log('stderr', stderr);
    //     }
    // );

});

app.use(express.static('build/'));
app.listen(3001);
