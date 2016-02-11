const Lab = require('lab');
const Code = require('code');

const Procmon = require('../lib/process-monitor.js');

var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;

var expect = Code.expect;

describe('process-monitor', function () {
  it('should initialize', function (done) {
    expect(function () {
      Procmon.monitor({ pid: 1 });
    }).not.to.throw();

    expect(function () {
      Procmon.monitor({ pid: [ 1, 2 ] });
    }).not.to.throw();

    expect(function () {
      Procmon.monitor();
    }).to.throw();

    done();
  });

  it('should start and stop', function (done) {
    var testMon = Procmon.monitor({ pid: 1 });

    testMon.start();
    expect(testMon.isRunning).to.equal(true);
    testMon.stop();
    expect(testMon.isRunning).to.equal(false);

    done();
  });

  it('should raise stats events', function (done) {
    var testMon = Procmon.monitor({
      pid: process.pid,
      interval: 10,
      format: '{cpu}% CPU - {mem} MEM'
    }).start();

    testMon.on('stats', function (stats) {
      expect(stats.cpu).to.exist();
      expect(stats.mem).to.exist();
      expect(stats.out).to.exist();

      done();
    });
  });
});
