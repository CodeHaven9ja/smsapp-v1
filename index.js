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
var ParseDashboard = require('parse-dashboard');



var port = process.env.PORT || 3030;
var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}
// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/1';

var serverUri;
if (process.env.PARSE_SERVER_URI) {
  serverUri = process.env.PARSE_SERVER_URI + process.env.PARSE_MOUNT;
} else {
  serverUri = 'http://localhost:3030/1';
}
var publicServerURL;
if (process.env.PUB_SERVER_URL) {
  publicServerURL = process.env.PUB_SERVER_URL + mountPath;
} else {
  publicServerURL = 'http://localhost:3030/1';
}

Parse.initialize(process.env.APP_ID || '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC', "unused", process.env.MASTER_KEY || '2h7bu8iPlLZ43Vt80rB97X2CDFmY087P');
Parse.serverURL = serverUri;

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/smsappv1',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || '9o87s1WOIyPgoTEGv0PSp9GXT1En9cwC',
  masterKey: process.env.MASTER_KEY || '2h7bu8iPlLZ43Vt80rB97X2CDFmY087P', //Add your master key here. Keep it secret!
  serverURL: serverUri,  // Don't forget to change to https if needed
  // Enable email verification
  appName: 'Schoolpop',
  publicServerURL: publicServerURL,
  verifyUserEmails: true,
  emailAdapter:{
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      // The address that your emails come from
      fromAddress: 'Schoolpop <noreply@'+ process.env.DOMAIN_NAME+ '>',
      // Your domain from mailgun.com
      domain: process.env.DOMAIN_NAME || 'http://localhost:3030',
      // Your API key from mailgun.com
      apiKey: process.env.MAILGUN_API_KEY || 'key-mykey',
    }
  },
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

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
app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.static(path.join(__dirname, '/bower_components')));

// Establish routes

// make '/app' default route
// app.get('/', (req, res) => {
//    return res.redirect('/home');
// });

app.use(mountPath, api);


// app.use('/home', require('./routes/home')(Parse));
// app.use('/dash', require('./routes/dash')(Parse));
// app.use('/staff', require('./routes/staff/staff.controller')(Parse));
// app.use('/users', require('./routes/users'));


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

app.get('/404', function(req, res, next){
  // trigger a 404 since no other middleware
  // will match /404 after this one, and we're not
  // responding here
  next();
});

app.get('/403', function(req, res, next){
  // trigger a 403 error
  var err = new Error('not allowed!');
  err.status = 403;
  next(err);
});

app.get('/500', function(req, res, next){
  // trigger a generic (500) error
  next(new Error('keyboard cat!'));
});

// Error handlers

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

// $ curl http://localhost:3030/notfound
// $ curl http://localhost:3030/notfound -H "Accept: application/json"
// $ curl http://localhost:3030/notfound -H "Accept: text/plain"

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.

app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);
  res.render('500', { error: err });
});

module.exports = app;
