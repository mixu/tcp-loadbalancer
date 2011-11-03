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

// Toggle backends

// only all
// only 1
// only 2

