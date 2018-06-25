const express = require('express')
const http = require('http');
const httpProxy = require('http-proxy');

const app = express()
const proxy = httpProxy.createProxyServer({});

var server = http.createServer(function(req, res) {
    if(req.url.match(new RegExp('^\/api\/'))) {
      console.log('routing request to api');
      proxy.web(req, res, { target: 'http://127.0.0.1:8000' });
      return;
    }
    if(req.url.match(new RegExp('^\/admin\/'))) {
      console.log('routing request to api');
      proxy.web(req, res, { target: 'http://127.0.0.1:8000' });
      return;
    }
    if(req.url.match(new RegExp('^\/static\/'))) {
      console.log('routing request to api');
      proxy.web(req, res, { target: 'http://127.0.0.1:8000' });
      return;
    }
    console.log('routing request to FE');
    proxy.web(req, res, { target: 'http://127.0.0.1:8081' });
});

console.log("listening on port 8082")
server.listen(8082);


