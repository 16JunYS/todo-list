var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

/* 
ToDo List
  1. List
  2. Add
  3. Complete
  4. Delete
  */
var listRouter = require('./routes/todo');
// express 패키지 호출출하여 app 변수 객체 생성
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// use ejs package for view engine
app.set('view engine', 'ejs');

/*
* app.use(); // middle-ware 연결
*/
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

/* use installed modules */
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

/* link To-Do related middle-ware */
app.get('/list', listRouter.list);
app.post('/add', listRouter.add);
app.post('/complete', listRouter.complete);
app.post('/del', listRouter.delete);
app.post('/edit', listRouter.edit);
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
  res.render('error.jade');
});

//app 객체를 모듈로
module.exports = app;
