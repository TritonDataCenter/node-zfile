var bindings = require('../build/Release/zfile_bindings');

function createZoneFileStream(options, callback) {
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

module.exports = {
    createZoneFileStream: createZoneFileStream
};
