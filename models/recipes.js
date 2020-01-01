const db = require('../db')
const ObjectId = require('mongodb').ObjectID

const getCollection = () => db.get().collection('recipes')

const groupByType = { $group: { '_id': '$type', recipes: { $push: '$$ROOT' } } }
const notDeleted = { $match: { deleted: { $ne: true } } }
const matchTags = tags => ({ $match: { tags: { $all: tags.split(',') } } })
const matchQuery = query => {
	const pattern = new RegExp(query, 'i')
	return { $match: { $or: [{ title: pattern }, { shortDescription: pattern }] } }
}

exports.all = cb => {
	getCollection().aggregate([notDeleted, groupByType], cb)
}

exports.getRecipeById = (recipeId, cb) => {
	getCollection().find(ObjectId(recipeId)).next(cb)
}

exports.addRecipe = (data, cb) => {
	getCollection().insertOne(data, cb)
}

exports.deleteRecipe = (recipeId, cb) => {
	exports.updateRecipe({ _id: recipeId, deleted: true }, cb)
}

exports.updateRecipe = (data, cb) => {
	const {_id, ...rest} = data
	getCollection().updateOne({ _id: ObjectId(_id) }, { $set: rest }, cb)
}

exports.getRecipesByTags = (tags, cb) => {
	getCollection().aggregate([notDeleted, matchTags(tags), groupByType], cb)
}

exports.getRecipesByQuery = (query, cb) => {
	getCollection().aggregate([notDeleted, matchQuery(query), groupByType], cb)
}

exports.getTags = cb => {
	getCollection().distinct('tags', cb)
}
