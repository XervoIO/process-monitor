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
    test.expect(2);

    test.ok(procmon, 'should be available.');
    test.ok(procmon.monitor({ pid: 0 }), 'should initialize with single pid.');

    test.done();
  },
  'chaining': function(test) {
    test.expect(3);

    test.strictEqual(procmon, procmon.monitor({ pid: 0 }), 'should be chainable from monitor.');
    test.strictEqual(procmon, procmon.monitor({ pid: 0 }).start(), 'should be chainable from start.');
    test.strictEqual(procmon, procmon.monitor({ pid: 0 }).stop(), 'should be chainable from stop.');

    test.done();
  },
  'starting and stopping': function(test) {
    test.expect(2);
    procmon.monitor({ pid: 0 }).start();

    test.strictEqual(procmon.isRunning, true, 'should start');
    procmon.stop();
    test.strictEqual(procmon.isRunning, false, 'should stop');

    test.done();
  }
};
