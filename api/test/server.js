var expect = require('chai').expect
var Server = require('../lib/server')
var request = require('request')

describe('Server', function () {

  this.timeout(5000);

  var server = null

  it('should start the server', function (done) {
    server = Server({ port: 9898, mock: true, verbose: false });
    server.start();
    server.on('ready', function () {
      done();
    })
  })

  it('should expose server options object', function () {
    expect(server.options).to.be.an('object')
  })

  // it('should expose the server instance', function () {
  //   expect(server.server).to.be.an('object')
  // })

  it('should have a valid ping status', function () {
    request('http://localhost:9898/api/ping', function (err, res) {
      expect(err).to.be.null
      expect(res.statusCode).to.be.equal(200)
    })
  })

  it('should perform a valid request', function () {
    request('http://localhost:9898/api/test?sample=hello', function (err, res) {
      expect(res.statusCode).to.be.equal(200)
    })
  })

  it('should perform an invalid request', function () {
    request('http://localhost:9898/api/test', function (err, res) {
      expect(res.statusCode).to.be.equal(400)
    })
  })

  it('should parse post bodies properly', function () {
    request.post({
        headers: {
          'Content-Type' : 'application/json'
        },
        url: 'http://localhost:9898/api/usr',
        body: '{"usr_id": "1", "usr_name": "John Smith"}'
      }, function (err, res) {
        expect(res.statusCode).to.be.equal(200);
    });
  });

})
