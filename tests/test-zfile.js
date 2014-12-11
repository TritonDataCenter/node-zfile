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
    this.path = '/etc/passwd';
    callback();
}

function tearDown(callback) {
    callback();
}

function testNoOptions(test) {
    test.expect(1);
    test.throws(function () {
        zfile.createZoneSocket();
    });
    test.done();
}

function testMissingZone(test) {
    var self = this;
    test.expect(1);
    test.throws(function () {
        zfile.createZoneSocket({
            path: self.path
        });
    });
    test.done();
}

function testMissingPath(test) {
    var self = this;
    test.expect(1);
    test.throws(function () {
        zfile.createZoneSocket({
            zone: self.zone
        });
    });
    test.done();
}

function testMissingCallback(test) {
    var self = this;
    test.expect(1);
    test.throws(function () {
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
    test.throws(function () {
        zfile.createZoneSocket({
            zone: '----abc123',
            path: self.path
        }, 5);
    });
    test.done();
}

function testSuccessStream(test) {
    var self = this;
    test.expect(3);
    test.equal(process.getuid(), 0, 'must be root to run this test');

    zfile.createZoneFileStream(
        {zone: self.zone, path: self.path},
        onZFileStream);

    function onZFileStream(err, stream) {
        test.ok(!err,
            err + ' (must have zone named "foo" or set TEST_ZONE envvar)');

        test.ok(stream, 'stream was returned');
        stream.pipe(process.stdout);
        stream.resume();
        test.done();
    }
}

function testSuccessFileDescriptor(test) {
    var self = this;
    test.expect(3);
    test.equal(process.getuid(), 0, 'must be root to run this test');

    zfile.getZoneFileDescriptor(
        {zone: self.zone, path: self.path},
        onZFileDescriptor);

    function onZFileDescriptor(err, fd) {
        test.ok(!err,
            err + ' (must have zone named "foo" or set TEST_ZONE envvar)');
        test.ok(fd);
        test.done();
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
    'test success file descriptor': testSuccessFileDescriptor,
    'test success stream': testSuccessStream
};
