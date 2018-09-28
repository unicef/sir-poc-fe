var express = require('express'); // eslint-disable-line
var browserCapabilities = require('browser-capabilities'); // eslint-disable-line
var proxy = require('http-proxy-middleware');

const app = express();
const basedir = __dirname + '/build/'; // eslint-disable-line

function getSourcesPath(request) {
  let clientCapabilities = browserCapabilities.browserCapabilities(
      request.headers['user-agent']);

  clientCapabilities = new Set(clientCapabilities); // eslint-disable-line

  if (clientCapabilities.has('es2015')) {
    return basedir + 'es6-bundled/';
  } else {
    return basedir + 'es5-bundled/';
  }
}

// FOR TESTING ONLY
// routes /api/ requests to the test server so we can test the build with
// the same back-end used for development
// app.use('/api', proxy({target: 'http://localhost:8080'}));

app.get(/.*service-worker\.js/, function(req, res) {
  res.sendFile(getSourcesPath(req) + 'service-worker.js');
});

app.get(/.*web-animations-next-lite.min\.js/, function(req, res) {
  res.sendFile(getSourcesPath(req) + 'node_modules/web-animations-js/web-animations-next-lite.min.js');
});

app.get(/.*moment.min\.js/, function(req, res) {
  res.sendFile(getSourcesPath(req) + 'node_modules/moment/min/moment.min.js');
});

app.use('/', (req, res, next) => {
  express.static(getSourcesPath(req))(req, res, next);
});


app.listen(8082);
