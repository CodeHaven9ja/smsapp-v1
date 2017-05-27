#!/usr/bin/env node
var httpServer = require('http'),
		app = require('./index'),
		ParseServer = require('parse-server').ParseServer,
		ParseDashboard = require('parse-dashboard');

var port = app.get('port');

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
    classNames: ["Mail", "Result", "School"] // List of classes to support for query subscriptions
  }
});

app.use(mountPath, api);

var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('Schoolpop is running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

