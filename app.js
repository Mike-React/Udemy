var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors());
app.use(bodyParser.json());

//start my code
const mysql = require('mysql');
const db = mysql.createConnection({
    host: 'udemydb.cht2mfxc27yv.ap-southeast-2.rds.amazonaws.com',
    user: 'udemydb',
    password: 'udemydb1',
    database: 'udemy_db'
});

db.connect(() => {
    // if(err) {
    //     throw err;
    // }
    console.log('MySql Connected...');
});

/*
app.get('/createcommenttable', (req, res) => {
    let sql = 'CREATE TABLE Comments (CommentID int AUTO_INCREMENT, UserID int, Comment VARCHAR(255), PRIMARY KEY (CommentID), FOREIGN KEY (UserID) REFERENCES Users(UserID))';
    db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});
*/

/*
app.get('/addvideo', (req, res) => {
    let video = {VideoID: 1, CourseID: 1, VideoURL: 'https://udemycnmvideo.s3-ap-southeast-2.amazonaws.com/smartfly.mp4'};
    let sql = 'INSERT INTO Videos SET ?';
    let query = db.query(sql, video, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});
*/

app.get('/getcourses', (req, res) => {
    let sql = 'SELECT * FROM Courses';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

app.post('/getcategorycourses', (req, res) => {
    let category = req.body.Category;
    let sql = 'SELECT * FROM Courses ' + 'WHERE CategoryID = ' + category;
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

app.get('/getcategories', (req, res) => {
    let sql = 'SELECT * FROM Categories';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

/*
app.get('/getvideos', (req, res) => {
    let sql = 'SELECT * FROM Videos';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});
*/

app.post('/login', (req, res) => {
    let user = {Email: req.body.Email, Password: req.body.Password};
    let sql = 'SELECT * FROM Users ' + 'WHERE Email = "' + user['Email'] + '" AND Password = MD5("' + user['Password'] + '")';
    let query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

app.post('/postcomment', (req, res) => {
    let comment = {Name: req.body.Name, AvatarURL: req.body.AvatarURL, Comment: req.body.Comment};
    let sql = 'INSERT INTO Comments SET ?';
    let query = db.query(sql, comment, (err, result) => {
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.post('/signup', (req, res) => {
    let user = {UserName: req.body.UserName, Email: req.body.Email, Password: req.body.Password};
    let sql = 'INSERT INTO Users(UserName, Email, Password) VALUES ("' + user['UserName'] + '","' + user['Email'] + '",MD5("' + user['Password'] + '"))';
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.post('/addcourse', (req, res) => {
    let course = {CourseName: req.body.CourseName, Price: req.body.Price, ImageURL: req.body.ImageURL, Description: req.body.Description, CategoryID: req.body.CategoryID};
    let sql = 'INSERT INTO Courses SET ?';
    let query = db.query(sql, course, (err, result) => {
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});

//  app.listen('3002', () => {
//      console.log('Server started on port 3002');
//  });
//end my code

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
