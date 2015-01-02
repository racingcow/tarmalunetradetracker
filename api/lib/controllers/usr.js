var winston = require('winston');

module.exports = {
  create: create
};

function create(req, res, next) {

  var user = req.body;
  res.send(200);

  winston.info(user);

  return next();
}