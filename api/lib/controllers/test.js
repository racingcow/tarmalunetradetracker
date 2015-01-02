var Client = require('../client')

module.exports = test;

function test(req, res) {
  console.log(req.params.sample);
  // sample test endpoint controller
  if (req.params.sample === 'hello') {
    res.send(200);
  } else {
    res.send(400);
  }
}