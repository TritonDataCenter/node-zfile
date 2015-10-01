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

var MODES = { 'r': 0, 'w': 1, 'a': 2 };

function getZoneFileDescriptor(opts, callback) {
    if (!opts) throw new TypeError('opts required');
    if (!(opts instanceof Object)) {
        throw new TypeError('opts must be an Object');
    }
    if (!opts.zone) throw new TypeError('opts.zone required');
    if (!opts.path) throw new TypeError('opts.path required');
    if (!callback) throw new TypeError('callback required');
    if (!(callback instanceof Function)) {
        throw new TypeError('callback must be a Function');
    }

    if (Object.keys(MODES).indexOf(opts.mode) === -1) {
        throw new TypeError('mode must be "r", "w", or "a"');
    }

    bindings.zfile(opts.zone, opts.path, MODES[opts.mode], callback);
}


function createZoneFileStream(opts, callback) {
    var mode = opts.mode || 'r';
    if (Object.keys(MODES).indexOf(mode) === -1) {
        throw new TypeError('mode must be "r", "w", or "a"');
    }

    opts.mode = mode;

    getZoneFileDescriptor(opts, function (err, fd) {
        if (err) {
            return callback(err);
        }

        var stream;

        if (mode === 'r') {
            stream = fs.createReadStream(null, { fd: fd });
        } else if (mode === 'w' || mode === 'a') {
            stream = fs.createWriteStream(null, { fd: fd });
        }

        return callback(null, stream);
    });
}

module.exports = {
    createZoneFileStream: createZoneFileStream,
    getZoneFileDescriptor: getZoneFileDescriptor
};
