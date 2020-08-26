const MongoClient = require('mongodb').MongoClient;

const state = {
	db: null,
};

exports.connect = function (url, dbName, done) {
	if (state.db) return done();

	const client = new MongoClient(url);
	client.connect(function (err, client) {
		if (err) return done(err);
		state.db = client.db(dbName);
		done()
	})
};

exports.get = function () {
	return state.db
};

exports.close = function (done) {
	if (state.db) {
		state.db.close(function (err) {
			state.db = null;
			state.mode = null;
			done(err)
		})
	}
};
