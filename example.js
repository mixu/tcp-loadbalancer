var LoadBalancer = require('./lib/load_balancer');

var config = {
  host: 'localhost',
  port: 8000
};

var backends = [
  { host: 'localhost', port: 8001 },
  { host: 'localhost', port: 8002 }
];

var request_number = 0;
var server = new LoadBalancer(function() {
  return request_number++ % backends.length;
});
server.backends(backends);
server.listen(config.port, config.host);
console.log('Server running at', config.host, config.port);

