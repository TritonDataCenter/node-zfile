/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2014, Joyent, Inc.
 */

var bindings = require('../build/Release/zfile');
var fs = require('fs');

function getZoneFileDescriptor(options, callback) {
    if (!options) throw new TypeError('options required');
    if (!(options instanceof Object)) {
        throw new TypeError('options must be an Object');
    }
    if (!options.zone) throw new TypeError('options.zone required');
    if (!options.path) throw new TypeError('options.path required');
    if (!callback) throw new TypeError('callback required');
    if (!(callback instanceof Function)) {
        throw new TypeError('callback must be a Function');
    }

    bindings.zfile(options.zone, options.path, callback);
}


function createZoneFileStream(options, callback) {
    getZoneFileDescriptor(options, function (err, fd) {
        if (err) {
            return callback(err);
        }
        var stream = fs.createReadStream(null, { fd: fd });
        callback(null, stream);
    });
}

module.exports = {
    createZoneFileStream: createZoneFileStream,
    getZoneFileDescriptor: getZoneFileDescriptor
};
