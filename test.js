var procmon = require('./lib/process-monitor').monitor({ pid: process.pid }).start();
procmon.on('stats', function(stats) { console.dir(stats); });
