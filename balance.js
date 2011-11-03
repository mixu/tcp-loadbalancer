var repl = require('repl');
var LoadBalancer = require('./lib/load_balancer');

var config = {
  host: 'localhost',
  port: 843
};

var backends = [
  { host: 'localhost', port: 8001 },
  { host: 'localhost', port: 8002 }
];

var server = new LoadBalancer(function(enabled) {
  return enabled[Math.floor(Math.random() * enabled.length)];
});
server.backends(backends);
server.only(1);
server.listen(config.port, config.host);
console.log('Server running at', config.host, config.port);

var context = {
  // Show status
  status: function() {
    var enabled = server.enabled();
    console.log('Status:');
    backends.forEach(function(backend, index) {
      console.log(index+'   '+(enabled.indexOf(''+index) > -1 ? 'enabled ' : 'disabled')+'    '+backend.host, ':', backend.port);
    });
  },
  // Enable/disable backends
  enable: function(index) {
    if(index === undefined) {
      console.log('Usage: enable(index)');
      return;
    }
    server.enable(index);
    context.status();
  },
  disable: function(index) {
    if(index === undefined) {
      console.log('Usage: disable(index)');
      return;
    }
    server.disable(index);
    context.status();
  },
  only: function(index) {
    server.only(index);
    server.forceDisconnects();
    context.status();
  },
  log: function() {
    server.log();
  },
  connections: function() {
    server.connections();
  }
};

var r = repl.start();
r.context.r = context;
r.b = server;

console.log('REPL commands:', Object.keys(context));
