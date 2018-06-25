var express = require('express');
var proxy = require('http-proxy-middleware');
var cors = require('cors');

var app = express();

// app.use(cors());
app.use('/api', proxy({target: 'http://localhost:8000'}), cors());
app.use('/admin', proxy({target: 'http://localhost:8000'}), cors());
app.use('/static', proxy({target: 'http://localhost:8000'}), cors());
app.use('/', proxy({target: 'http://localhost:8081'}), cors());

app.listen(8082);
