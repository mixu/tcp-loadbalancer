var repl = require('repl');
var LoadBalancer = require('./lib/load_balancer');

var config = {
  host: 'localhost',
  port: 8000
};

var backends = [
  { host: 'localhost', port: 8001 },
  { host: 'localhost', port: 8002 }
];
var enabled = Object.keys(backends);

var server = new LoadBalancer(function() {
  return enabled[Math.floor(Math.random() * enabled.length)];
});
server.backends(backends);
server.listen(config.port, config.host);
console.log('Server running at', config.host, config.port);

var context = {
  // Show status
  status: function() {
    console.log('Status:');
    backends.forEach(function(backend, index) {
      console.log(index+'   '+(enabled.indexOf(''+index) > -1 ? 'enabled ' : 'disabled')+'    '+backend.host, ':', backend.port);
    });
  },
  // Toggle backends
  toggle: function(index) {
    if(index === undefined) {
      console.log('Usage: toggle(index)');
      return;
    }
    var pos = enabled.indexOf(''+index);
    if(pos < 0) {
      enabled.push(''+index);
    } else {
      enabled.splice(pos, 1);
    }
    context.status();
  }
};

var r = repl.start();
r.context.r = context;
r.b = server;

console.log('REPL commands:', Object.keys(context));