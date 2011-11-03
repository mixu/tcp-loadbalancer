var http = require('http');
var t = http.createServer(function(sreq, sres) {
  sres.end('Hello 1');
}).listen(8001, '0.0.0.0');

var t2 = http.createServer(function(sreq, sres) {
  sres.end('Hello 2');
}).listen(8002, '0.0.0.0');
