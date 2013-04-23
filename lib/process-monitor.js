/*
 * process-monitor
 * https://github.com/onmodulus/process-monitor
 *
 * Copyright (c) 2012 Modulus
 * Licensed under the MIT license.
 */

/*
 Node module dependencies
-------------------------------------------------------------------------- */

var stringFormat = require('stringformat')
  , Emitter = require('events').EventEmitter
  , exec = require('child_process').exec
  , usage = require('usage')
  , s = require('string');

/*
 Helper functions
-------------------------------------------------------------------------- */

/**
 * Parses the process detail output into and object.
 * @param  {string} res Output from the PS command.
 * @return {object} CPU and memory statistics.
 */

var parsePSOutput = function(res, pid) {
  var lines = res.split('\n')
    , data = s(lines[1]).collapseWhitespace().s
    , dataParts = data.split(' ');

  return {
    pid: pid
  , cpu: dataParts[0] || '0.0'
  , mem: dataParts[1] || '0'
  };
};

/*
 ProcMon
-------------------------------------------------------------------------- */

/**
 * Initializes a new process monitor object.
 * @param {object} config Configuration options.
 * @constructor
 */
 
var ProcMon = function(config) {
  /**
   * Local event emitter instance to handle the PS.
   * @type {Emitter}
   */
   
  this.events = new Emitter();

  /**
   * Format string for formatting the output to a string.
   * @type {string}
   */
   
  this.format = config.format || '';

  /**
   * Update interval.
   * @type {number}
   * @default 1000
   */
   
  this.interval = config.interval || 1000;

  /**
   * Reference to the monitor loop interval.
   * @type {function}
   */
   
  this.intervalId = null;

  /**
   * Value indicating whether the monitor loop has been started.
   * @type {Boolean}
   */
   
  this.isRunning = false;

  /**
   * Process IDs to monitor.
   * @type {array}
   */
   
  this.pid = config.pid;

  /**
   * The technique used to find CPU usage.
   * @type {string}
   */

  this.technique = 'ps';
  if(config.technique === 'proc') {
    this.technique = 'proc';
  }

  /**
   * Process statistics detail.
   * @type {object}
   */
   
  this.stats = {};
};

ProcMon.prototype = {
  /**
   * Handle the specified event then fire the callback.
   * @param  {string}   event    The name of the event.
   * @param  {Function} callback The function callback.
   */
   
  on: function(event, callback) {
    this.events.on(event, callback);
  }

  /**
   * Start the process monitor loop.
   * @return {ProcMon} Chainable instance of this ProcMon.
   */
   
, start: function() {
    var self = this;

    // Already running.
    if (this.isRunning) {
      return this;
    }

    this.isRunning = true;

    this.intervalId = setInterval(function() {
      self.updateStats();
    }, self.interval);

    return this;
  }

  /**
   * Stop the process monitor loop.
   * @return {ProcMon} Chainable instance of this ProcMon.
   */
   
, stop: function() {
    clearInterval(this.intervalId);
    this.isRunning = false;

    return this;
  }

  /**
   * Updates stat information.
   */
   
, updateStats: function() {
    var self = this;

    this.pid.forEach(function(pid) {

      if(self.technique === 'ps') {
        self.updateStatsPS(pid);
      }
      else {
        self.updateStatsProc(pid);
      }
    });
  }

  /**
   * Updates stat information using the ps command.
   */

, updateStatsPS: function(pid) {

    var self = this;

    var command = 'ps -p ' + pid + ' -o %cpu,rss';

    exec(command, function(err, stdout, stderr) {
      if(err) {
        self.events.emit('error', err);
      }
      else {
        self.stats = parsePSOutput(stdout, pid);
        self.stats.out = self.format && stringFormat(self.format, self.stats);
        self.events.emit('stats', self.stats);
      }
    });
  }

  /**
   * Updates stat information using /proc file data.
   */

, updateStatsProc: function(pid) {

    var self = this;

    usage.lookup(pid, { keepHistory: true }, function(err, result) {
      if(err) {
        self.events.emit('error', err);
      }
      else {
        self.stats = { pid: pid, cpu: result.cpu, mem: result.memory / 1024 };
        self.stats.out = self.format && stringFormat(self.format, self.stats);
        self.events.emit('stats', self.stats);
      }
    });
  }
};

/*
 process-monitor API
-------------------------------------------------------------------------- */

/**
 * Process-monitor API definition.
 * @param  {object}   config Configuration options.
 * @return {ProcMon}  Chainable instance of ProcMon.
 */
 
module.exports.monitor = function(config) {
  if (typeof config.pid === 'undefined') {
    throw new TypeError('You must specify at least one PID');
  }

  if (typeof config.pid === 'number') {
    var pid = config.pid;
    config.pid = [];

    config.pid[0] = pid;
  }

  return new ProcMon(config);
};
