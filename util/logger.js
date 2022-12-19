// const { createLogger, transports, format } = require('winston');


// const logger = createLogger({

//   transports: [
//     new transports.Console({level: 'silly'})
//   ]
// });

// module.exports = logger;

const { createLogger, transports, format } = require('winston');


const logger = createLogger({
    format:  format.printf((info) => {
        return `[${info.level.toUpperCase().padEnd(7)}]: ${info.message}`
      }),
      level : 'verbose',
  transports: [
    new transports.Console()
  ]
});

module.exports = logger;
