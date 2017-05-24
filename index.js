#!/usr/bin/env node

// Example express application adding the parse-server module to expose Parse
// compatible API routes.
/*jshint esversion: 6 */

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var Parse = require('parse/node').Parse;
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var redis = require('redis');
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);
var flash = require('connect-flash');



var port = process.env.PORT || 3030;

var app = express();

app.set('port', port);

if ('production' == app.settings.env) app.disable('verbose errors');

// Configure app
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); 

// Use Middleware
app.use(bodyParser.urlencoded({
  extended: true
}));
// parse application/json 
app.use(bodyParser.json());

var client = redis.createClient(process.env.REDISCLOUD_URL||'redis://localhost:6379', {no_ready_check: true});
app.use(cookieParser());
app.use(expressSession({
  store: new RedisStore({'client': client}),
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// Serve static assets from the /public folder
app.use(express.static(path.join(__dirname, './public')));
app.get('/', (req, res) => {
  res.status(200).send("ok");
});


var config = require('./config.json');

var r = require('./modules/service-response.js');

app.post('/resetPassword', (req, res) =>{

  var mountPath = process.env.PARSE_MOUNT || '/1';
  var server_url;

  if (process.env.PARSE_SERVER_URI) {
      server_url = process.env.PARSE_SERVER_URI + mountPath;
  }

  var s;
  if (server_url) {
    s = server_url + '/functions/resetPassword';
  }

  var options = {
    url: s  || config.apiUrl + '/functions/resetPassword',
    headers: {
      'X-Parse-Application-Id': process.env.APP_ID || 'myAppId',
      'X-Parse-Revocable-Session': 1,
      'Content-Type': 'application/json'
    },
    json:{
      q: req.body.q
    }
  };
  r.post(options).then((status) =>{
    res.redirect('/');
  }).catch((err) =>{
    res.render('/home/login');
  });
});

// make JWT token available to angular app
app.get('/token', function (req, res) { 
  res.send(req.session.user.sessionToken);
});

module.exports = app;
