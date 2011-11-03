var net = require('net');

var LoadBalancer = function(callback) {
  // configuration
  this._config = {
    maxIdle: 500 //ms
  };
  // TCP server
  this._server = null;
  // array of backends
  this._backends = null;
  // array of backends that are active
  this._enabled_backends = null;
  // function used to decide which backend to hit
  this._scheme = callback || function(enabled) {
    return enabled[Math.floor(Math.random() * enabled.length)];
  };
  // connection counter
  this._counter = 0;
  // array of connections
  this._connections = [];
  // log items
  this._log = [];
};

// Set backends
LoadBalancer.prototype.backends = function(arr) {
  if(arr) {
    this._backends = arr;
    this._enabled_backends = Object.keys(this._backends);
  }
  return this._backends
};

// Enable a backend
LoadBalancer.prototype.enable = function(index) {
  var pos = this._enabled_backends.indexOf(''+index);
  if(pos < 0) {
    enabled.push(''+index);
  }
};

// Disable a backend
LoadBalancer.prototype.disable = function(index) {
  var pos = this._enabled_backends.indexOf(''+index);
  if(pos > -1) {
    this._enabled_backends.splice(pos, 1);
  }
};

// Only enable a single backend
LoadBalancer.prototype.only = function(index) {
  this._enabled_backends = [ '' + index];
};

// Get enabled backends
LoadBalancer.prototype.enabled = function() {
  return this._enabled_backends;
};

// Start the server
LoadBalancer.prototype.listen = function(port, host) {
  var self = this;
  this._server = net.createServer(function(sreq) {
    self.onConnect(sreq);
  });
  this._server.listen(port, host);
};

// Triggered when a client connects
LoadBalancer.prototype.onConnect = function(sreq) {
  var self = this;
  var creq = new net.Socket( { type: 'tcp4' });
  var identifier = this._counter++;
  var current = this._scheme(this._enabled_backends);

  this._connections[identifier] = ({ front: sreq, back: creq });
  console.log('Client connected');
  this._log.push([identifier, 'Sending request to', this._backends[current]]);

  creq.connect(this._backends[current].port, this._backends[current].host);
  sreq.pipe(creq);
  creq.pipe(sreq);
  sreq.setTimeout(this._config.maxIdle, function() {
//   sreq.end();
//   sreq.destroy();
  });
  creq.setTimeout(this._config.maxIdle, function() {
//   creq.end();
//   creq.destroy();
  });
//  sreq.on('data', function(data) {
//    console.log(data.toString().split("\n")[0]);
//  });
  creq.on('end', function() {
   self._log.push([identifier, 'Backend disconnected']);
   self._connections[identifier].back = null;
  });
  sreq.on('end', function() {
   self._log.push([identifier, 'Frontend disconnected']);
   self._connections[identifier].front = null;
  });
};

// Print out the log
LoadBalancer.prototype.log = function() {
  console.log(this._log);
};

// Print out the active connections
LoadBalancer.prototype.connections = function() {
  console.log(this._connections.filter(function(o){ return o.front && o.back }));
};

// Force all connections to end
LoadBalancer.prototype.forceDisconnects = function() {
  var self = this;
  this._connections.forEach(function(o, index) {
    if(o.back) {
      o.back.end();
      self._connections[index].back = null;
    }
    if(o.front) {
      o.front.end();
      self._connections[index].front = null;
    }
  });
};

module.exports = LoadBalancer;
