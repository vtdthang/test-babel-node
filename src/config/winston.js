import appRoot from 'app-root-path';
import { createLogger, transports } from 'winston';
import wdrf from 'winston-daily-rotate-file';

var transport = new transports.DailyRotateFile({
    filename: `${appRoot}/logs/application-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    handleExceptions: true,
    json: true
});

transport.on('rotate', function (oldFilename, newFilename) {
    // do something fun
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

var options = {
    file: {
        level: 'info',
        //filename: `${appRoot}/logs/${generator(new Date())}.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

let loggerWinston = createLogger({
    transports: [
        transport,
        //new transports.File(options.file),
        new transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

loggerWinston.stream = {
    write: function (message, encoding) {
        loggerWinston.info(message);
    },
};

export default loggerWinston;