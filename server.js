var httpServer = require('http'),
		app = require('./index'),
		ParseServer = require('parse-server').ParseServer;

var port = app.get('port');

httpServer.createServer(app).listen(port, () => {
    console.log('School management system running on port ' + port + '.');
});

// This will enable the Live Query real-time server
// ParseServer.createLiveQueryServer(httpServer);

