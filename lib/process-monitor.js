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
   * Process ID to monitor.
   * @type {number}
   * @default 1
   */
  this.pid = config.pid || 1;

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
    var command = 'ps -p ' + this.pid + ' -o %cpu,rss';

    exec(command, function(err, stdout, stderr) {
      self.stats = err || parsePSOutput(stdout);
      self.events.emit('stats', self.stats);
    });
  }
};

/*
 process-monitor API
-------------------------------------------------------------------------- */

/**
 * Process-monitor API definition.
 * @param  {object} config Configuration options.
 * @return {ProcMon} Chainable instance of this ProcMon.
 */
module.exports.monitor = function(config) {
   return new ProcMon(config);
};
