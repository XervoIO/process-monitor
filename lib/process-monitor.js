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
var Emitter = require('events').EventEmitter
  , exec = require('child_process').exec
  , s = require('string');

/*
 ProcMon
-------------------------------------------------------------------------- */

/**
 * Initializes a new process monitor object using the specified
 * parameters.
 * @param {object} params Configuration parameters.
 * @constructor
 */
var ProcMon = function(params) {
  /**
   * Instance of configuration parameters from initialization.
   * @type {object}
   */
  this.params = params;

  /**
   * Process ID to monitor.
   * @type {number}
   */
  this.pid = this.params && this.params.pid || 0;

  /**
   * Process statistics detail.
   * @type {object}
   */
  this.stats = null;

  /**
   * Reference to the monitor loop interval.
   * @type {function}
   */
  this.intervalId = null;

  /**
   * Local event emitter instance to handle the PS.
   * @type {Emitter}
   */
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
   */
, start: function() {
    var self = this;

    // Already running.
    if (this.intervalId !== null) {
      return;
    }

    this.intervalId = setInterval(function() {
      self.updateStats();
      self.events.emit('stats', self.stats);
    }, self.params.interval);

    return this;
  }

  /**
   * Stop the process monitor loop.
   */
, stop: function() {
    clearInterval(this.intervalId);
  }

  /**
   * Executes the PS command and updates the stats object
   * with the result.
   */
, updateStats: function() {
    var self = this;
    var command = 'ps -p ' + this.pid + ' -o %cpu,rss';
    console.log(command);
    exec(command,
      function(err, stdout, stderr) {
        self.stats = parsePSOutput(stdout);
      }
    );
  }

  /**
   * Initializes the process monitor.
   * @param  {object} params Configuration parameters.
   * @return {object} An initialized ProcMon object.
   */
, monitor: function(params) {
    params.pid = params.pid || 0;
    params.interval = params.interval || 1000;
    return new ProcMon(params);
  }
};

/*
 process-monitor
-------------------------------------------------------------------------- */

/**
 * Process-monitor API definition.
 * @return {ProcMon} Makes the ProcMon constructor publicly accessible.
 */
exports['process-monitor'] = function() {
  return ProcMon;
};
