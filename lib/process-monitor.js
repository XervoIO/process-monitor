/*
 * process-monitor
 * https://github.com/onmodulus/process-monitor
 *
 * Copyright (c) 2012 Modulus
 * Licensed under the MIT license.
 */

 /**
  * Node module dependencies.
  */
var Emitter = require('events').EventEmitter,
       exec = require('child_process').exec,
          s = require('string');

/**
 * Initializes a new process monitor object using the specified
 * parameters.
 * @param {object} params Configuration parameters.
 */
var ProcMon = function(params) {
  this.params = params;
  this.pid = this.params && this.params.pid || 0;
  this.stats = null;
  this.intervalId = null;
  this.events = new Emitter();
};

/**
 * Parses the process detail output into and object.
 * @param  {string} input Output from the PS command.
 * @return {object} CPU and memory statistics.
 */
var parsePSOutput = function(input) {
  var lines = input.split('\n');
  var data = s(lines[1]).collapseWhitespace().s;
  var dataParts = data.split(' ');

  return {
    cpu: dataParts[0],
    mem: dataParts[1]
  };
};

ProcMon.prototype = {
  on: function(e, cb) {
    this.events.on(e, cb);
  }
, start: function() {
    var self = this;

    // Already running.
    if(this.intervalId !== null) {
      return;
    }

    this.intervalId = setInterval(function() {
      self.execute();
      self.events.emit('stats', self.stats);
    }, self.params.interval);

    return this;
  }
, stop: function() {
    clearInterval(this.intervalId);
  }
, execute: function() {
    var self = this;
    var command = 'ps -p ' + this.pid + ' -o %cpu,rss';
    console.log(command);
    exec(command,
      function(err, stdout, stderr) {
        self.stats = parsePSOutput(stdout);
      }
    );
  }
, monitor: function(params) {
    params.pid = params.pid || 0;
    params.interval = params.interval || 1000;
    return new ProcMon(params);
  }
};

exports['process-monitor'] = function() {
  return ProcMon;
};
