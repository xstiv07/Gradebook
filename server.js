//call the packages
var express = require('express'),
	app = express(), //define our app using express
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	mongoose = require('mongoose'),
	path = require('path'),
	config = require('./config');

//use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configure our app to handle Cross Origin Resource Sharing requests
//we are setting out configuration to allow requests from other domains to prevent CORS errors. This allows any domain to access our API
app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
	next();
});

//log all requests to the console
app.use(morgan('dev'));

//connect to a database
mongoose.connect(config.database);

//set static files location
app.use(express.static(__dirname + '/public'));


//routes for API
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);


//main catchall route
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
})

//start the server
app.listen(config.port);
console.log('Listening on port ' + config.port + "...");