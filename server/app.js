var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
let Keycloak = require('keycloak-connect');
var session = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

var memoryStore = new session.MemoryStore();
let kcConfig = {
  "realm": "MyDemo",
  "auth-server-url": "http://localhost:8080/auth",
  "ssl-required": "external",
   "credentials": {
    "secret": "c8debd7f-8f1d-4f1f-8b83-f8394670a6d4"
  },
  "confidential-port": 0,
  "policy-enforcer": {}
}
let keycloak = new Keycloak({ store: memoryStore }, kcConfig);

app.use(keycloak.middleware());

app.get('/',keycloak.protect(), function (req, res) {
  console.log(keycloak.protect())
  res.json({a:1});
});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

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
