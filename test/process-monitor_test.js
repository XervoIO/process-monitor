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
    this.testMon = procmon.monitor({ pid: process.id });
    done();
  },
  'initialization': function(test) {
    test.expect(1);

    test.ok(this.testMon, 'should be available.');

    test.done();
  },
  'starting and stopping': function(test) {
    test.expect(2);

    this.testMon.start();
    test.strictEqual(this.testMon.isRunning, true, 'should start');
    this.testMon.stop();
    test.strictEqual(this.testMon.isRunning, false, 'should stop');

    test.done();
  }
};
