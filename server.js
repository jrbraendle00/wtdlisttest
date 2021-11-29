/* const express = require('express');
const app = express();

const path = require('path');

const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', function(req, res) {
    
    res.sendFile(path.join(__dirname+'/public/frontend.html'));
});

app.listen(port); */

const express = require('express');
const app = express();

const path = require('path');

const port = process.env.PORT || 3000;


app.use(express.static('public'));

app.get('/', function(req, res) {
    
    res.sendFile(path.join(__dirname+'/public/frontend.html'));
});

app.listen(port); 