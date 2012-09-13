# process-monitor

Monitors the CPU and memory usage for a PID or collection of PIDs.

## Getting Started
_(note: this module is not currently available in the npm registry)_
Install the module with: `npm install process-monitor`

    var procmon = require('process-monitor');
    procmon.monitor({ pid: process.id }).start();

## Documentation
Generated code documentation is available in the docs directory. This documentation is generated using
`docco-husky` - to regenerate the documentation, run `$ docco-husky lib/*`.

## Examples

    var procmon = require('./process-monitor').monitor({ pid: process.pid }).start();

    procmon.on('stats', function(stats) {
      console.dir(stats);
    });

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Modulus
Licensed under the MIT license.
