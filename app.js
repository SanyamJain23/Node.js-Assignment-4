var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');
var createError = require('http-errors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');
var favoriteRouter = require('./routes/favoriteRouter');

var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var app = express();

app.all('*', (req,res,next) => {
  if(req.secure) next();
  else res.redirect(307, 'https://'+req.hostname+':'+app.get('secPort')+req.url);
})

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);

const mongoose = require('mongoose');
const url = config.mongoUrl;

mongoose.connect(url)
.then(() => {
  console.log("Connected Successfully");
})
.catch((err) => console.log(err));

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;