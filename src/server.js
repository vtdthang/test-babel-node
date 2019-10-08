import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import rfs from 'rotating-file-stream';
 
const app = express();

const logDirectory = path.join(__dirname, 'log');
const accessLogStream = rfs(generator(new Date()), {
    size: '10M',
    interval: '1d', // rotate daily
    path: logDirectory
});

//use morgan middleware
app.use(morgan(':remote-addr :remote-user [:date[iso]] :method :url HTTP/:http-version :req[Authorization] ":referrer" ":user-agent" :response-time ms', { stream: accessLogStream })); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.status(200).send('hello, world!')
});

app.post('/', function (req, res) {
    const test = req.body;
    console.log(test);
    res
        .status(200)
        .send('hello, world!')
});
  
//server is listening
app.listen(5500, function () {
	console.log("Server started...");
});

function pad(num) {
    return (num > 9 ? "" : "0") + num;
}
 
function generator(time) {
    if (!time) return "file.log";
 
    var monthAndYear = time.getFullYear() + "_" + pad(time.getMonth() + 1);
    var day = pad(time.getDate());
 
    return monthAndYear + "_" + day + "_" + "file.log";
}