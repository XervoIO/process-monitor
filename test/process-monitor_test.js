var procmon = require('../lib/process-monitor.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['process-monitor'] = {
  setUp: function(done) {
    done();
  },
  'initialization': function(test) {
    test.expect(3);

    test.ok(procmon.monitor({ pid: 1 }), 'should initialize with a single PID.');
    test.ok(procmon.monitor({ pid: [ 1, 2 ] }), 'should initialize with an array of PIDs.');
    test.throws(function() {
      procmon.monitor();
    }, TypeError, 'should throw type error with no initialization object');

    test.done();
  },
  'starting and stopping': function(test) {
    test.expect(2);
    var testMon = procmon.monitor({ pid: 1 });

    testMon.start();
    test.strictEqual(testMon.isRunning, true, 'should start.');
    testMon.stop();
    test.strictEqual(testMon.isRunning, false, 'should stop.');

    test.done();
  },
  'stats event': function(test) {
    var testMon = procmon.monitor({ pid: 0, interval: 10, format: '{cpu}% CPU - {mem} MEM' }).start();

    testMon.on('stats', function(stats) {
      test.expect(4);

      test.ok(stats, 'stats event should be called and provide stats object');
      test.ok(stats.cpu, 'stats object should have cpu property');
      test.ok(stats.mem, 'stats object should have mem property');
      test.ok(stats.out, 'should output formatted string results');

      test.done();
    });
  }
};
