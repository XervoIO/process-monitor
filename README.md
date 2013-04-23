# process-monitor

[![Build Status](https://secure.travis-ci.org/fiveisprime/process-monitor.png)](http://travis-ci.org/fiveisprime/process-monitor)

Monitors the CPU and memory usage for a PID or collection of PIDs asynchronously and emits an event with a stats object which includes information about the specified PID. Allows a user-specified format string for creating a friendly status message.

## Getting Started

Install the module:

    npm install process-monitor

Use it in your script:

    var procmon = require('process-monitor');

Monitor a single PID or multiple PIDs:

    // Single PID
    var single = procmon.monitor({ pid: 1, interval: 5000 }).start();

    // Multiple PIDs
    var multi = procmon.monitor({ pid: [1, 2, 3] }).start();

Handle the `stats` response - an event will be emitted for each of the specified PIDs and includes the PID:

    single.on('stats', function(stats) {
      console.dir(stats); // Outputs: { pid: 1, cpu: '0.0', mem: '2248', out: '' }
    })

_Note: if a PID is not found, the resulting cpu and mem properties will be 0.0 and 0 respectively._

## Documentation
Generated code documentation is available [here](http://eventargs.com/docs/process-monitor/) and in the docs directory. This documentation is generated using
`docco-husky` - to regenerate the documentation, run `$ docco-husky lib/*`.

Currently the `monitor` function accepts the following configuration options:

### pid

The `pid` option may be a single process ID or an array from process IDs to monitor. The PID is also included in the `stats` object on when the `stats` event is emitted.

    procmon.monitor({ pid: 1}).start();
    procmon.monitor({ pid: [1, 2, 3] }).start();

### interval

The rate in milliseconds at which the processes are checked and the stats event is emitted. The rate defaults to 1000 miliseconds.

    procmon.monitor({ pid: 1, interval: 5000 }).start();

### format

Specify a format string that will be updated in the `stats` object on update. Use `{pid}`, `{cpu}`, and `{mem}` to output a friendly message on update.

    procmon.monitor({
      pid: [1, 2],
      interval: 5000,
      format: 'PID {pid} - {cpu}% CPU - {mem} memory'
    }).start();

    procmon.on('stats', function(stats) {
      console.log(stats.out);
    });

### technique
There are two supported techniques for reading process information.

    procmon.monitor({
      pid: 1,
      interval: 5000,
      technique: 'ps'
    }).start();

* `ps` (default): Uses the `ps` command to find CPU and memory usage. CPU value returned from the `ps` command is a lifetime average and does not reflect the current usage.
* `proc`: Uses information stored in the /proc files to calculate current CPU usage. Implementation comes from the [node-usage](https://npmjs.org/package/usage) module. Only supported on Linux.

## Release History
* 2013/04/23 - v0.3.0 - Added support for current CPU usage. Uses [node-usage](https://npmjs.org/package/usage) module.
* 2012/09/28 - v0.2.0 - Added `format` to the configuration object which accepts a format for the output (the `out` property of the `stats` object). Uses [stringformat](https://npmjs.org/package/stringformat) which allows the use of `{cpu}`, `{mem}`, and `{pid}` in the format string.
* 2012/09/24 - v0.1.1 - Documentation update for publishing to npm.
* 2012/09/14 - v0.1.0 - Initial release.

## License
Copyright (c) 2012 Modulus
Licensed under the MIT license.
