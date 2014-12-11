## Synopsis

The node-zfile library provides a means of access to a stream (or
file-descriptor) to a file within a zone (from the global zone).

The reasoning behind is to provide a safe method to read the contents of a file
without needing to worry about atomically checking for potentially malicious
symlinks (and such).


## Example Usage

To use the library to get a readable file-stream:

    var zfile = require('zfile');

    var myPath = '/etc/passwd';

    zfile.createZoneFileStream(
        {zone: self.zone, path: myPath},
        onZFileStream);

    function onZFileStream(err, stream) {
        stream.pipe(process.stdout);
        stream.resume();
    }

To use the library to get a file descriptor to file:

    var zfile = require('zfile');

    var myPath = '/etc/passwd';

    zfile.getZoneFileDescriptor(
        {zone: self.zone, path: myPath},
        onZFileDescriptor);

    function onZFileDescriptor(err, fd) {
        // ...
    }

## Installation

    git clone http://github.com/joyent/node-zfile
    cd node-zfile
    node-waf configure build

## License

MPL-2.0

## Credits

This addon is based on the node-zsock addon by the venerable Mark Cavage.
See https://github.com/mcavage/node-zsock
