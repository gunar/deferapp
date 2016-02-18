var fsPath = require('path');
var winston = require('winston');

var logger = function (path, prefix, level) {
  level = level || 'debug';
  path = path || './logs';
  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        level: level,
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
      filename: fsPath.join(path, prefix + '-' + level + '.log'),
      level: level,
      json: true,
      maxsize: 5*1024*1024,
      maxFiles: 5,
      colorize: false
    });
  });
  return logger;
};

module.exports = logger;
