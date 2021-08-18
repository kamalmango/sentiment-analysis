var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var nlpRouter = require('./routes/nlp');
var usersRouter = require('./routes/users')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/nlp', nlpRouter);
//app.use('/users', usersRouter)
app.use('/many-comments', express.static(path.join(__dirname, 'public/users.html')))

module.exports = app;
