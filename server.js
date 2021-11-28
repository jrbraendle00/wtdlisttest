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
    var sql = require('mysql');

    var config = sql.createPool({
        host: 'us-cdbr-east-04.cleardb.com',
        user: 'baeffcfa0361e8',
        password: 'd75d807f',
        database: 'heroku_f4a58d3b92ef321'
    });
    
    module.exports = config;
    
    var sql = "select * from task_list";
    config.query(sql, function(err, result) {
        if (err) throw err;
        console.log("record retrieved");
        res.send(result);
    });
    
    res.sendFile(path.join(__dirname+'/public/frontend.html'));
});

app.listen(port); 