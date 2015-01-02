var Server = require('./lib/server'),
    winston = require('winston');

var server = Server({ port: 9898, mock: false, verbose: true });
server.start();

server.on('ready', function () {
  winston.info('Server reported "ready" event to client.');
});