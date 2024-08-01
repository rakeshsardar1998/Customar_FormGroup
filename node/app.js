var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config({path: path.resolve(__dirname,`./.env`)});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var maxNewYorkRouter = require('./routes/maxNewYork');
var iciciPruRouter = require('./routes/iciciPru');
var aegonLifeRouter = require('./routes/aegonLife');
var edelweissLifeRouter = require('./routes/edelweissLife');
var bhartiLifeRouter = require('./routes/bhartiAxa');
var hdfcLifeRouter = require('./routes/hdfcLife');
var kotakLifeRouter = require('./routes/kotakLife');
var commonRouter = require('./routes/common');

var app = express();

app.all("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/maxny', maxNewYorkRouter);
app.use('/icicpru', iciciPruRouter);
app.use('/aegonlife', aegonLifeRouter);
app.use('/edelweisslife', edelweissLifeRouter);
app.use('/bhartiaxa', bhartiLifeRouter);
app.use('/hdfclife', hdfcLifeRouter);
app.use('/kotaklife', kotakLifeRouter);
app.use('/common', commonRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

// const _port =process.env.PORT || 3000;
// app.listen(_port,'192.168.7.128',() =>{console.log(`Listening on port ${_port}`)});
