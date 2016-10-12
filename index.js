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



var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}
// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';

var serverUri = process.env.PARSE_SERVER_URI + process.env.PARSE_MOUNT || 'http://localhost:1337/parse';

var publicServerURL;
if (process.env.PUB_SERVER_URL) {
  publicServerURL = process.env.PUB_SERVER_URL + mountPath;
} else {
  publicServerURL = 'http://localhost:1337/parse';
}

Parse.initialize(process.env.APP_ID || 'myAppId', "unused", process.env.MASTER_KEY || 'myMasterKey');
Parse.serverURL = serverUri;

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/smsappv1',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || 'myMasterKey', //Add your master key here. Keep it secret!
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
      domain: process.env.DOMAIN_NAME || 'http://localhost:1337',
      // Your API key from mailgun.com
      apiKey: process.env.MAILGUN_API_KEY || 'key-mykey',
    }
  },
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});

var dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": "http://localhost:1337/parse",
      "appId": "myAppId",
      "masterKey": "myMasterKey",
      "appName": "SMS Local"
    },
    {
      "serverURL": serverUri,
      "appId": process.env.APP_ID,
      "masterKey": process.env.MASTER_KEY,
      "appName": "Schoolpop.ng Prod",
      "production": true
    }
  ],
  "users":[
    {
      "user":"mrsmith9ja",
      "pass":"P@b0p0v!b"
    },{
      "user":"xlboyz",
      "pass":"Summer500!"
    }
  ]
}, true);
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

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
app.use(express.static(path.join(__dirname, '/public/assets')));
app.use(express.static(path.join(__dirname, '/bower_components')));

app.use(mountPath, api);
// make the Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);
// Establish routes

// make '/app' default route
app.get('/', (req, res) => {
    return res.redirect('/home');
});

app.use('/home', require('./routes/home')(Parse));
app.use('/dash', require('./routes/dash')(Parse));
app.use('/users', require('./routes/users'));


var config = require('./config.json');

var r = require('./modules/service-response.js');

app.post('/resetPassword', (req, res) =>{

  var mountPath = process.env.PARSE_MOUNT || '/parse';
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

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, () => {
    console.log('School management system running on port ' + port + '.');
});

// // Start app
// app.listen(port, () => {
//   console.log('Ready on port ' + port + '.');
// });

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
