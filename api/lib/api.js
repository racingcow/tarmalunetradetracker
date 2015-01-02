var controllers = require('./controllers')

module.exports = function (app) {

  // define the API endpoints
  app.restify.get(app.options.basePath + '/ping', controllers.ping);

  app.restify.get(app.options.basePath + '/test', controllers.test);
  app.restify.post(app.options.basePath + '/test', controllers.test);

  app.restify.post(app.options.basePath + '/usr', controllers.usr.create);
}
