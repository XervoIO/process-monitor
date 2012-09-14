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

var Emitter = require('events').EventEmitter
  , exec = require('child_process').exec
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
  , cpu: dataParts[0] || ''
  , mem: dataParts[1] || ''
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
   * Executes the PS command and updates the stats object
   * with the result.
   */
, updateStats: function() {
    var self = this;

    this.pid.forEach(function(pid) {
      var command = 'ps -p ' + pid + ' -o %cpu,rss';

      exec(command, function(err, stdout, stderr) {
        self.stats = parsePSOutput(stdout, pid);
        self.events.emit('stats', self.stats);
      });
    });
  }
};

/*
 process-monitor API
-------------------------------------------------------------------------- */

/**
 * Process-monitor API definition.
 * @param  {object} config Configuration options.
 * @return {ProcMon} Chainable instance of ProcMon.
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
