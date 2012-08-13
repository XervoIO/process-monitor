var emitter = require('events').EventEmitter,
       exec = require('child_process').exec,
          S = require('string');


var PM = function(params) {
  this.params = params;
  this.pid = this.params.pid;
  this.stats = null;
  this.intervalId = null;
  this.events = new emitter();
};

PM.prototype.on = function(e, cb) {
  this.events.on(e, cb);
};

PM.prototype.start = function() {
  var self = this;

  // Already running.
  if(this.intervalId !== null) {
    return;
  }

  self.intervalId = setInterval(function() {
    self.execute();
    self.events.emit('stats', self.stats);
  }, self.params.interval);

  return this;
};

PM.prototype.stop = function() {
  clearInterval(this.intervalId);
};

PM.prototype.execute = function() {
  var self = this;
  var command = 'ps -p ' + this.pId + ' -o %cpu,rss';
  console.log(command);
  exec(command,
    function(err, stdout, stderr) {
      self.stats = parsePSOutput(stdout);
    }
  );
};

PM.monitor = function(params) {
  // Validate the input params.
  params.pId = params.pId || 0;
  params.interval = params.interval || 1000;
  return new PM(params);
};

var parsePSOutput = function(input) {
  var lines = input.split('\n');

  var data = S(lines[1]).collapseWhitespace().s;
  var dataParts = data.split(' ');

  return {
    cpu: dataParts[0],
    mem: dataParts[1]
  };
};

module.exports = PM;