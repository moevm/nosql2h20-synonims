var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var logger = require('morgan');

var indexRouter = require('./routes/index');
var databaseRouter = require('./routes/database');
var analysisRouter = require('./routes/analysis');
var wordRouter = require('./routes/word');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text())
//app.use((req, res, next) => {console.log(req.body); next()})
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/database', databaseRouter);

app.use('/analysis', analysisRouter);

app.use('/word', wordRouter);

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
