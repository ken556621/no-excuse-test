const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();
admin.initializeApp();

app.get('/test', (req, res) => {
    res.send('test success!')
});


exports.auth = functions.https.onRequest((req, res) => {
    const userInfo = {
        userEmail: req.body.email,
        userPassword: req.body.password
    };
    const email = userInfo.userEmail;
    const password = userInfo.userPassword;
    res.send(req.body);  
});

exports.createUser = functions.https.onRequest((req, res) => {
    res.send(req);
});

exports.api = functions.https.onRequest(app);


