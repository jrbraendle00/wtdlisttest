const express = require('express');
const app = express();

//var path = require('path');

const port = process.env.PORT || 3000;

//process.env.PWD = process.cwd();

app.use(express.static('public'));

app.get('/', function(req, res) {
    
    res.send("sdfsdf");

});

app.listen(port, () => {
    //console.log('listening at ${port}');
});