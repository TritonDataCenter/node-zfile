var fs = require('fs');
var testCase = require('nodeunit').testCase;

var zfile = require('../lib/zfile');
function setUp(callback) {
    this.zone = process.env.TEST_ZONE;
    this.path = '/etc/passwd';
    callback();
}

function tearDown(callback) {
    try {
        var path = '/zones/' + this.zone + '/root' + this.path;
        fs.unlinkSync(path);
    } catch (e) {
    }
    callback();
}

function testNoOptions(test) {
    test.expect(1);
    test.throws(function() {
      zfile.createZoneSocket();
    });
    test.done();
}

function testMissingZone(test) {
    var self = this;
    test.expect(1);
    test.throws(function() {
      zfile.createZoneSocket({
        path: self.path
      });
    });
    test.done();
}

function testMissingPath(test) {
    var self = this;
    test.expect(1);
    test.throws(function() {
      zfile.createZoneSocket({
        zone: self.zone
      });
    });
    test.done();
}

function testMissingCallback(test) {
    var self = this;
    test.expect(1);
    test.throws(function() {
      zfile.createZoneSocket({
        zone: 'abc123',
        path: self.path
      });
    });
    test.done();
}


function testInvalidCallback(test) {
    var self = this;
    test.expect(1);
    test.throws(function() {
      zfile.createZoneSocket({
        zone: 'abc123',
        path: self.path
      }, 5);
    });
    test.done();
}

function testSuccess(test) {
    var self = this;
    test.expect(3);
    test.equal(process.getuid(), 0, "must be root to run this test");


    zfile.createZoneFileStream({zone: self.zone, path: self.path}, onZFileStream);

    function onZFileStream(err, fd) {
      test.ok(!err, err + " (must have zone named 'foo' or set TEST_ZONE envvar)");
      test.ok(fd);
      console.log("fd = %d", fd);
      test.done();
    }
}

module.exports = {
    setUp: setUp,
    tearDown: tearDown,
    "test no options": testNoOptions,
    "test no zone specified": testMissingZone,
    "test no path specified": testMissingPath,
    "test no callback specified": testMissingCallback,
    "test invalid callback specified": testInvalidCallback,
    "test success": testSuccess
};
