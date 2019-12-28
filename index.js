require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./db');

app.engine('pug', require('pug').__express);
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.all('/*', function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
	res.setHeader('Access-Control-Allow-Headers',
		'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, ' +
		'Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
	);
	next();
});

app.use(require('./controllers'));

// Connect to Mongo on start
db.connect(process.env.MONGODB_URI, function (err) {
	if (err) {
		console.log('Unable to connect to Mongo.', err);
		process.exit(1)
	} else {
		const port = process.env.PORT || 5000;
		app.listen(port, function () {
			console.log(`Listening on port ${port}`)
		})
	}
});
