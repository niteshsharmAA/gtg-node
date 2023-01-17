const { append } = require('express/lib/response');
const { createLogger, transports, format } = require('winston');
const customFormat = format.combine(format.timestamp(),format.printf((info  ) => {
     return `${info.timestamp} - [${info.level.toUpperCase().padEnd(5)}] - ${info.message}`
}));



const winstonLogger = createLogger({
    format:customFormat,
     transports: [
        new transports.Console(),
        new transports.File({filename:'./logger/app.log'})
     ]
});

const logger = {
    debug(id, message, payload) {
        winstonLogger.debug(prepareMessage(id, message));
    },
    info(id, message, payload) {
        winstonLogger.info(prepareMessage(id, message));
    },
    error(id, message, payload) {
        winstonLogger.error(prepareMessage(id, message));
    }
};


function prepareId(logId = 'PATH_UNKNOWN', req, tag) {
    let result = `[${logId}]`;

    if (tag) result = `${result}|${tag}`;
    if (req?.id) result = `${result}|${req.id}`;

    return result;
}

function prepareMessage(id, message) {
    let result = `${prepareId(id)} `;
    return result;
}

module.exports = logger;
