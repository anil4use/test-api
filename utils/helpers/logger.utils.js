const winston = require("winston");
const { combine, timestamp, printf, colorize } = winston.format;
const devLoggerFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] : ${message}`;
});

const devLogger = () => {
  return winston.createLogger({
    level: "debug",
    format: combine(
      colorize(),
      timestamp({ format: "HH:mm:ss" }),
      devLoggerFormat
    ),
    // defaultMeta: { service: "user-service" },
    transports: [new winston.transports.Console()],
  });
};

module.exports = { devLogger};
