module.exports = ping;

function ping(req, res, next) {
  res.send('pong');
  return next();
}