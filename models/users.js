const db = require('../db');
const ObjectId = require('mongodb').ObjectID

const getCollection = () => db.get().collection('users');

exports.findById = (id, cb) => getCollection().findOne(ObjectId(id), cb)

exports.findByName = (name, cb) => getCollection().findOne({name: name}, cb)

exports.addUser = (data, cb) => getCollection().insertOne(data, cb)
