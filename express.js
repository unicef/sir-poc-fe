const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express()

app.use(cors({
    origin: 'https://test1.dantab.demo2.nordlogic.com',
    credentials: false
  }));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.post('/', (req, res) => {
    console.log(req.body);
    res.send({
        status: 'ok',
        body: req.body
    });
});


app.listen(8082, (req, res) => {
    console.log('Example app listening on port 8082!');
});
