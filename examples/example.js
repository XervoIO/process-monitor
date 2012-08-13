var procmon = require('./process-monitor').monitor({ pId: process.pid }).start();

procmon.on('stats', function(stats) {
  console.log(stats);
});