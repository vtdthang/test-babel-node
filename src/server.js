import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { assignId, morganLogger } from './middlewares/logger';

import loggerWinston from './config/winston';

const app = express();
app.use(assignId)

const logDirectory = path.join(__dirname, 'logs');
// const stream = createStream(generator(new Date()), {
//     size: "10M", // rotate every 10 MegaBytes written
//     interval: "1d", // rotate daily
//     compress: "gzip",
//     path: logDirectory // compress rotated files
// });

const KEY_ID = "123456";
const TEAM_ID = "1234567"
const CLIENT_ID = "com.your.bundle.id";
const APPLE_AUTH_URL = "https://appleid.apple.com/auth/token";
//const DEFAULT_SCOPE = 'email';
const TOKEN_AUDIENCE = 'https://appleid.apple.com';

//use morgan middleware
//app.use(morgan('combined', { stream: loggerWinston.stream }))
app.use(morganLogger(logDirectory));
//app.use(morgan(':remote-addr :remote-user [:date[iso]] :method :url HTTP/:http-version :req[Authorization] ":referrer" ":user-agent" :response-time ms', { stream: stream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// GET PRIVATE KEY
const getPrivateKey = () => {
    //read your key
    const pKey = fs.readFileSync("./security/AuthKey_XXXXXXXX.p8");

    return pKey;
}

const getClientSecret = () => {

    const timeNow = Math.floor(Date.now() / 1000);

    const claims = {
        iss: TEAM_ID,
        iat: timeNow,
        exp: timeNow + 15777000,
        aud: TOKEN_AUDIENCE,
        sub: CLIENT_ID,
    };

    const header = { alg: 'ES256', kid: KEY_ID };
    const pkey = getPrivateKey();

    return jwt.sign(claims, pkey, { algorithm: 'ES256', header });
};

const getAuthorizationToken = async (code) => {

    const url = new URL(ENDPOINT_URL);
    url.pathname = '/auth/token';

    const form = {
        client_id: CLIENT_ID,
        client_secret: getClientSecret(),
        code,
        grant_type: 'authorization_code',
        //redirect_uri: options.redirectUri,
    };

    const body = await axios.post(APPLE_AUTH_URL, form, { headers: { 'content-type': 'application/x-www-form-urlencoded' } });
    return JSON.parse(body.data);
};

app.get('/nodemailer', function (req, res) {
    try {
        nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport({
                host: 'smtp.googlemail.com', // Gmail Host
                port: 465, // Port
                secure: true, // this is true as port is 465
                //service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USERNAME, //Gmail username
                    pass: process.env.GMAIL_PASSWORD // Gmail password
                }
            });

            let mailOptions = {
                from: '"Kazan Matsuri" <donotreply@xxx.com>',
                to: 'abc@xxx.com', // Recepient email address. Multiple emails can send separated by commas
                subject: 'Welcome Email',
                text: 'This is the email sent through Gmail SMTP Server.',
                html: "<b>Hello world?</b>" // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return;
                }
                console.log('Message sent: %s', info.messageId);
            });
        });
    } catch (error) {
        console.log(error);
    }
    res.status(200).send('hello, world!')
});

app.post('/', function (req, res) {
    const test = req.body;
    console.log(test);
    res
        .status(200)
        .send('hello, world!')
});

app.get("/test", (req, res) => {
    if (1) {
        loggerWinston.error("ABC")
    }

    res.status(404).send('Test error');
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // add this line to include winston logging
    loggerWinston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${JSON.stringify(req.body)}`);

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//server is listening
app.listen(5500, function () {
    console.log("Server started...");
});

function pad(num) {
    return (num > 9 ? "" : "0") + num;
}

function generator(time) {
    if (!time) return "file.log";

    var monthAndYear = time.getFullYear() + "_" + pad(time.getMonth() + 1);
    var day = pad(time.getDate());

    return monthAndYear + "_" + day + ".log";
}