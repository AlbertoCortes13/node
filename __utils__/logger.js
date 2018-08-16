const winston = require('winston');

const logger = winston.createLogger({
    level: winston.config.npm, // Defaults to npm
});

// NPM Loggin levels
// {
//    error: 0,     // Errors (Something non-trivial could not happen)
//    warn: 1,      // Something bad happen but it could be handled
//    info: 2,      // Something happen (Events, connection, table insert/update/delete, etc.)
//    verbose: 3,   // Unnecesary BUT informational message (Extra info, like connection strings, configuration used)
//    debug: 4,     // Variables values to debug while developing
//    silly: 5      // Dumb message to use as flags (The code ran through here, flag: 1, 2, 3, etc)
// }

if (process.env.NODE_ENV !== 'production') { // development
    logger.add(new winston.transports.Console({ // Console
        level: 'silly', // Defaults to silly
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.simple(),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
        ),
    }));
    logger.add(new winston.transports.File({ // File
        level: 'silly',
        filename: '../logs/log.log',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
        ),
    }));
} else { // Production
    logger.add(new winston.transports.Console({ // Console
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
        ),
    }));
    logger.add(new winston.transports.File({ // Console
        level: 'verbose',
        filename: '../logs/verbose.log',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
        ),
    }));
    logger.add(new winston.transports.File({ // Console
        level: 'warn',
        filename: '../logs/errors.log',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
        ),
    }));
}

module.exports = logger;
