import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { createStream } from 'rotating-file-stream';
import fs from 'fs';
import path from 'path';
import loggerWinston from '../config/winston';

const stream = (logDirectory) => {
    return createStream(generator(new Date()), {
        size: "10M", // rotate every 10 MegaBytes written
        interval: "1d", // rotate daily
        compress: "gzip",
        path: logDirectory // compress rotated files
    });
};


function pad(num) {
    return (num > 9 ? "" : "0") + num;
}

function generator(time) {
    if (!time) return "file.log";

    var monthAndYear = time.getFullYear() + "_" + pad(time.getMonth() + 1);
    var day = pad(time.getDate());

    return monthAndYear + "_" + day + ".log";
}


export const assignId = (req, res, next) => {
    req.id = uuidv4()
    next()
}

export const morganLogger = (logDirectory) => {
    morgan.token('body', (req, res) => {
        return JSON.stringify(req.body);
    })

    morgan.token('id', (req) => {
        return req.id;
    });

    return morgan(':id [:date[iso]] :remote-addr :remote-user :method :url HTTP/:http-version :body :req[Authorization] ":referrer" ":user-agent" "StatusCode :status" :response-time ms', { stream: loggerWinston.stream });
};