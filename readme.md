# tcp-loadbalancer - A TCP load balancer for testing load balancing

To run the example:

  node example.js
  node example_backends.js
  curl localhost:8000 # Hello 1
  curl localhost:8000 # Hello 2

To run the REPL client:

  node balance.js

Usage example:

  node balance.js
  Server running at localhost 8000
  > REPL commands: [ 'status', 'toggle' ]

  > r.status();
  Status:
  0   enabled     localhost : 8001
  1   enabled     localhost : 8002
  > r.toggle(0);
  Status:
  0   disabled    localhost : 8001
  1   enabled     localhost : 8002
