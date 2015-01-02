var _ = require('lodash')
var util = require('util')
var restify = require('restify')
var winston = require('winston')
var winstonAdapter = require('bunyan-winston-adapter')
var EventEmitter = require('events').EventEmitter
var pkg = require('../package.json')
var api = require('./api')

module.exports = function serverFactory(options) {
  return new Server(options)
}

function Server(options) {
  this.options = _.merge({}, this.defaults, options)
}

Server.prototype = Object.create(EventEmitter.prototype)

Server.prototype.defaults = {
  host: '0.0.0.0',
  port: 8080,
  debug: false,
  basePath: '/api'
}

Server.prototype.start = function () {

  winston.info('server starting');
  console.log('server starting');

  try {
    this._createServer()
  } catch (e) {
    this.emit('error', e)
  }
  return this
}

Server.prototype._createServer = function () {

  console.log('createServer');

  this.restify = restify.createServer({
    name: pkg.name,
    version: pkg.version,
    log: winstonAdapter.createAdapter(winston),
  });

  defineMiddleware(this);
  defineEndpoints(this);

  this.restify.listen(this.options.port, function () {
    winston.info('server is emitting "ready" event');
    this.emit('ready', this.options);
    winston.info('server is listening at %s:%s%s', this.options.host, this.options.port, this.options.basePath);
  }.bind(this));
}

Server.prototype.stop = function () {
  this.restify.close(function () {
    this.emit('close');
  }.bind(this));
}

function defineMiddleware(app) {
  console.log('middleware');
  app.restify.use(restify.queryParser());
  app.restify.use(restify.bodyParser());
  app.restify.use(restify.gzipResponse());
  app.restify.use(restify.fullResponse());
  app.restify.use(defineCORS);
  //app.restify.use(exposeServer(app));
  app.restify.opts(/\.*/, function (req, res) { res.send(204) });
}

function defineEndpoints(app) {
  api(app);
}

function exposeServer(app) {
  return function (req, res, next) {
    next()
  }
}

function defineCORS(req, res, next) {
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method'] || 'GET, POST, DELETE, PUT, PATCH')
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    if (req.headers['access-control-request-headers']) {
      res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'])
    }
  }
  next()
}
