// logger.js
const { createLogger, format, transports } = require('winston');

// Create a logger instance
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json() // Change this to format.simple() for readable logs
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
    ]
});

// Handle exceptions and rejections
logger.exceptions.handle(
    new transports.File({ filename: 'exceptions.log' })
);

logger.rejections.handle(
    new transports.File({ filename: 'rejections.log' })
);

module.exports = logger;
