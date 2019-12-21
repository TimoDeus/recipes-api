const db = require('../db');
const md5 = require('md5');

const getCollection = () => db.get().collection('users');

exports.verifyUser = (data, cb) => {
	data.password = md5(data.password);
	getCollection().find(data).next(cb);
};

exports.addUser = (data, cb) => {
	data.password = md5(data.password);
	getCollection().insertOne(data, cb);
};
