const express = require('express');
const app = express();

const path = require('path');

const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var sql = require('mysql');
//mysql://b445599726c648:18e985fb@us-cdbr-east-04.cleardb.com/heroku_d5fc58195132b53?reconnect=true
var config = sql.createPool({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b445599726c648',
    password: '18e985fb',
    database: 'heroku_d5fc58195132b53'
});

module.exports = config;

//GET ROUTES
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/login.html'));
});

app.get('/lists', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/frontend.html'));
});

app.get('/newuser', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/newuser.html'));
});



//POST ROUTES

//defualt homepage is the login screen
app.post('/', (req, res) => {

    var sql = "SELECT COUNT(*) FROM user WHERE username='" + req.body.username + "' AND password='" + req.body.password + "'";

    config.query(sql, function (err, result) {
        if (err) throw err;

        if (result[0]['COUNT(*)'] == 1) {
            console.log('valid user');

            res.redirect('/lists');
        } else {
            console.log('invalid user');

            res.redirect('/');
        }
        //console.log("record added");
    });


});

app.post('/newuser', async (req, res) => {

    var sql = "INSERT INTO user (username, password) VALUES ('" + req.body.username + "', '" + req.body.password + "')";
    config.query(sql, function (err, result) {
        if (err) throw err;
        //console.log("record added");
    });

    res.redirect('/');
    //send to page after account is successfully created
});

/* 
app.post('/lists', async(req, res) =>{
    
    var sql = "INSERT INTO task_list (Task_List_Name, Assoc_User) VALUES ('" + req.body.username + "', 'testuser')";
    config.query(sql, function(err, result) {
        if (err) throw err;
        //console.log("record added");
    });

    res.redirect('/');
});
 */
app.listen(port);