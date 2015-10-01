/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2014, Joyent, Inc.
 */

var fs = require('fs');
var testCase = require('nodeunit').testCase;

var zfile = require('../lib/zfile');
function setUp(callback) {
    this.zone = process.env.TEST_ZONE;
    if (!this.zone) {
        throw new Error('TEST_ZONE not given!');
    }

    this.path = '/etc/passwd';
    callback();
}

function tearDown(callback) {
    callback();
}

function testNoOptions(test) {
    test.expect(1);
    test.throws(function () {
        zfile.createZoneFileDescriptor();
    });
    test.done();
}

function testMissingZone(test) {
    var self = this;
    test.expect(1);
    test.throws(function () {
        zfile.createZoneFileDescriptor({
            path: self.path
        });
    });
    test.done();
}

function testMissingPath(test) {
    var self = this;
    test.expect(1);
    test.throws(function () {
        zfile.createZoneFileDescriptor({
            zone: self.zone
        });
    });
    test.done();
}

function testMissingCallback(test) {
    var self = this;
    test.expect(1);
    test.throws(function () {
        zfile.createZoneFileDescriptor({
            zone: 'abc123',
            path: self.path
        });
    });
    test.done();
}


function testInvalidCallback(test) {
    var self = this;
    test.expect(1);
    test.throws(function () {
        zfile.createZoneFileDescriptor({
            zone: '----abc123',
            path: self.path
        }, 5);
    });
    test.done();
}


function testSuccessReadFileDescriptor(test) {
    var self = this;
    test.expect(3);
    test.equal(process.getuid(), 0, 'must be root to run this test');

    zfile.getZoneFileDescriptor(
        { zone: self.zone, path: self.path, mode: 'r' },
        onZFileDescriptor);

    function onZFileDescriptor(err, fd) {
        test.ok(!err,
            err + ' (must have zone named "foo" or set TEST_ZONE envvar)');
        test.ok(fd > 0);
        test.done();
    }
}


function testSuccessWriteFileDescriptor(test) {
    var self = this;
    test.expect(3);
    test.equal(process.getuid(), 0, 'must be root to run this test');

    zfile.getZoneFileDescriptor(
        { zone: self.zone, path: self.path, mode: 'r' },
        onZFileDescriptor);

    function onZFileDescriptor(err, fd) {
        test.ok(!err,
            err + ' (must have zone named "foo" or set TEST_ZONE envvar)');
        test.ok(fd > 0);
        test.done();
    }
}


function testSuccessReadStream(test) {
    var self = this;
    test.expect(4);
    test.equal(process.getuid(), 0, 'must be root to run this test');

    zfile.createZoneFileStream(
        { zone: self.zone, path: self.path },
        onZFileStream);

    function onZFileStream(err, stream) {
        test.ok(!err,
            err + ' (must have zone named "foo" or set TEST_ZONE envvar)');

        test.ok(stream, 'stream was returned');
        stream.on('data', function (data) {
            test.ok(data.toString().match(/^root:x:/),
                    'should find our string');
            test.done();
        });

    }
}

function testInvalidModes(test) {
    var self = this;
    test.expect(3);
    test.equal(process.getuid(), 0, 'must be root to run this test');

    var path = '/tmp/test';

    test.throws(function () {
        zfile.createZoneFileStream(
            { zone: self.zone, path: path, mode: 'x' },
            onZFileStream);

        function onZFileStream() {
        }
    });

    test.throws(function () {
        zfile.createZoneFileStream(
            { zone: self.zone, path: path, mode: 'rw' },
            onZFileStream);

        function onZFileStream() {
        }
    });

    test.done();
}


function testSuccessWriteStream(test) {
    var self = this;
    test.expect(3);
    test.equal(process.getuid(), 0, 'must be root to run this test');
    var dataToWrite = 'Bite off more than you can chew, then chew it';

    var path = '/tmp/test';
    zfile.createZoneFileStream(
        { zone: self.zone, path: path, mode: 'w' },
        onZFileWriteStream);

    function onZFileWriteStream(err, stream) {
        test.ok(!err,
            err + ' (must have zone named "foo" or set TEST_ZONE envvar)');

        stream.write(dataToWrite, function () {
            var foo = fs.readFileSync(
                '/zones/'+self.zone+'/root' + path);


            test.equal(foo.toString(), dataToWrite);
            test.done();
        });
    }
}

module.exports = {
    setUp: setUp,
    tearDown: tearDown,
    'test no options': testNoOptions,
    'test no zone specified': testMissingZone,
    'test no path specified': testMissingPath,
    'test no callback specified': testMissingCallback,
    'test invalid callback specified': testInvalidCallback,
    'test successly opening a read file descriptor':
        testSuccessReadFileDescriptor,
    'test successly opening a write file descriptor':
        testSuccessWriteFileDescriptor,
    'test invalid modes': testInvalidModes,
    'test successly opening a read stream': testSuccessReadStream,
    'test success opening a write stream': testSuccessWriteStream
};
