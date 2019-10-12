import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import rfs from 'rotating-file-stream';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
 
const app = express();

const logDirectory = path.join(__dirname, 'log');
const accessLogStream = rfs(generator(new Date()), {
    size: '10M',
    interval: '1d', // rotate daily
    path: logDirectory
});

const KEY_ID = "123456";
const TEAM_ID = "1234567"
const CLIENT_ID = "com.your.bundle.id";
const APPLE_AUTH_URL = "https://appleid.apple.com/auth/token";
//const DEFAULT_SCOPE = 'email';
const TOKEN_AUDIENCE = 'https://appleid.apple.com';

//use morgan middleware
app.use(morgan(':remote-addr :remote-user [:date[iso]] :method :url HTTP/:http-version :req[Authorization] ":referrer" ":user-agent" :response-time ms', { stream: accessLogStream })); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// GET PRIVATE KEY
const getPrivateKey = () =>  {
    //read your key
    const pKey = fs.readFileSync("./security/AuthKey_XXXXXXXX.p8");
    
    return pKey;
}

const getClientSecret = () => {
  
    const timeNow = Math.floor(Date.now() / 1000);
  
    const claims = {
      iss: TEAM_ID,
      iat: timeNow,
      exp: timeNow + 15777000,
      aud: TOKEN_AUDIENCE,
      sub: CLIENT_ID,
    };
  
    const header = { alg: 'ES256', kid: KEY_ID };
    const pkey = getPrivateKey();
  
    return jwt.sign(claims, pkey, { algorithm: 'ES256', header });
};

const getAuthorizationToken = async (code) => {
  
    const url = new URL(ENDPOINT_URL);
    url.pathname = '/auth/token';
  
    const form = {
      client_id: CLIENT_ID,
      client_secret: getClientSecret(),
      code,
      grant_type: 'authorization_code',
      //redirect_uri: options.redirectUri,
    };
  
    const body = await axios.post(APPLE_AUTH_URL, form, { headers: { 'content-type': 'application/x-www-form-urlencoded' } });
    return JSON.parse(body.data);
};

app.get('/', function (req, res) {
  res.status(200).send('hello, world!')
});

app.post('/', function (req, res) {
    const test = req.body;
    console.log(test);
    res
        .status(200)
        .send('hello, world!')
});
  
//server is listening
app.listen(5500, function () {
    console.log("Server started...");
});

function pad(num) {
    return (num > 9 ? "" : "0") + num;
}
 
function generator(time) {
    if (!time) return "file.log";
 
    var monthAndYear = time.getFullYear() + "_" + pad(time.getMonth() + 1);
    var day = pad(time.getDate());
 
    return monthAndYear + "_" + day + "_" + "file.log";
}