var winston = require('winston');

var logger = function (path, prefix) {
  path = path || './logs';
  path = path + '/' + prefix + '-';
  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true
      })
    ]
  });
  var levels = [ 'error', 'warn', 'info', 'verbose', 'debug', 'silly' ];
  levels.forEach(function (level) {
    logger.add(winston.transports.File, {
      name: level+'-file',
      filename: path+level+'.log',
      level: level,
      json: true,
      maxsize: 5*1024,
      maxFiles: 5,
      colorize: false
    });
  });
  return logger;
};

module.exports = logger;
