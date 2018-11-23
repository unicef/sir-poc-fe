/*
For development run it as
  node server.js --dev
or to have it run on a specific port
  node server.js --dev -p 8084
*/
var express = require('express'); // eslint-disable-line
var browserCapabilities = require('browser-capabilities'); // eslint-disable-line
var proxy = require('http-proxy-middleware');

const app = express();
const basedir = __dirname + '/build/'; // eslint-disable-line
let port = 8080;

let portOptionIndex = process.argv.indexOf('-p');// eslint-disable-line

if (portOptionIndex > -1) {
  port = process.argv[portOptionIndex + 1];// eslint-disable-line
}

function getSourcesPath(request) {
  let clientCapabilities = browserCapabilities.browserCapabilities(
      request.headers['user-agent']);

  clientCapabilities = new Set(clientCapabilities); // eslint-disable-line

  if (clientCapabilities.has('modules') && clientCapabilities.has('es2015')) {
    return basedir + 'es6-bundled/';
  } else {
    return basedir + 'es5-bundled/';
  }
}

app.get(/.*service-worker\.js/, function(req, res) {
  res.sendFile(getSourcesPath(req) + 'service-worker.js');
});

app.use('/', (req, res, next) => {
  express.static(getSourcesPath(req))(req, res, next);
});

app.use((req, res) => {
    res.sendFile(getSourcesPath(req) + 'index.html');
});

console.log('Sir-fe server started on port', port);// eslint-disable-line
app.listen(port);
