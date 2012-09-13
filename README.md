# process-monitor

Monitors the CPU and memory usage for a PID or collection of PIDs.

## Getting Started
Install the module with: `npm install process-monitor`

    var procmon = require('process-monitor');
    procmon.monitor({ pid: process.id }).start();

## Documentation
_(Coming soon)_

## Examples

    var procmon = require('./process-monitor').monitor({ pid: process.pid }).start();

    procmon.on('stats', function(stats) {
      console.log(stats);
    });

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Modulus
Licensed under the MIT license.
