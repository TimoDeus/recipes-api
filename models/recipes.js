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

exports.all = (queryParams, cb) => {
	const pipeline = []
	pipeline.push(notDeleted)
	if (queryParams.query) {
		pipeline.push(matchQuery(queryParams.query))
	}
	if (queryParams.tags) {
		pipeline.push(matchTags(queryParams.tags))
	}
	pipeline.push(groupByType)
	getCollection().aggregate(pipeline, cb)
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
	const { _id, ...rest } = data
	getCollection().updateOne({ _id: ObjectId(_id) }, { $set: rest }, cb)
}

exports.getTags = cb => {
	getCollection().distinct('tags', cb)
}
