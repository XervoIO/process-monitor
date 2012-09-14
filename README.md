# process-monitor

Monitors the CPU and memory usage for a PID or collection of PIDs.

## Getting Started
_(note: this module is not currently available in the npm registry)_

Install the module:

    npm install git://github.com/onmodulus/process-monitor.git#develop

Use it in your script:

    var procmon = require('process-monitor');

Monitor a single PID or mulitple PIDs:

    // Single PID
    var single = procmon.monitor({ pid: 1, interval: 5000 }).start();

    // Multiple PIDs
    var multi = procmon.monitor({ pids: [1, 2, 3] }).start();

Handle the `stats` response - a response will emitted for each of the specified PIDs and includes the PID:

    single.on('stats', function(stats) {
      console.dir(stats); // Outputs: { pid: 1, cpu: '0.0', mem: '2248' }
    })

_Note: if a PID is not found, the resulting cpu and mem properties will be an empty string._

## Documentation
Generated code documentation is available in the docs directory. This documentation is generated using
`docco-husky` - to regenerate the documentation, run `$ docco-husky lib/*`.

Currently the `monitor` function accepts the following configuration options:

* `pid` - Single process ID to monitor
* `pids` - An array of PIDs to monitor
* `interval` - Rate at which the `stats` the process is checked and the stats even is emitted

## Release History
* 2012/09/14 - v0.1.0 - Initial release.

## License
Copyright (c) 2012 Modulus
Licensed under the MIT license.
