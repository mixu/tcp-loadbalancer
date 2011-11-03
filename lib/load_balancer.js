var net = require('net');

var LoadBalancer = function(callback) {
  this._config = {
    maxIdle: 500 //ms
  };
  this._backends = null;
  this._server = null;
  this._scheme = callback;
};

LoadBalancer.prototype.backends = function(arr) {
  this._backends = arr;
};

LoadBalancer.prototype.listen = function(port, host) {
  var self = this;
  this._server = net.createServer(function(sreq) {
    self.onConnect(sreq);
  });
  this._server.listen(port, host);
};

LoadBalancer.prototype.onConnect = function(sreq) {
  console.log('Client connected');
  var creq = new net.Socket( { type: 'tcp4' });
  var current = this._scheme();
  console.log('Sending request to', this._backends[current]);
  creq.connect(this._backends[current].port, this._backends[current].host);
  sreq.pipe(creq);
  creq.pipe(sreq);
  sreq.setTimeout(500, function() {
   console.log('sreq disconnected');
   sreq.end();
  });
  creq.setTimeout(500, function() {
   console.log('creq disconnected');
   creq.end();
  });
  sreq.on('data', function(data) {
    console.log(data.toString());
  });
};

module.exports = LoadBalancer;