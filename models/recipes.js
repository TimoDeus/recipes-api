const db = require('../db')
const ObjectId = require('mongodb').ObjectID

const getCollection = () => db.get().collection('recipes')

const groupByType = { $group: { '_id': '$type', recipes: { $push: '$$ROOT' } } }
const matchLabels = labels => ({ $match: { labels: { $all: labels.split(',') } } })
const matchFreetext = freetext => {
	const pattern = new RegExp(freetext, 'i')
	return { $match: { $or: [{ title: pattern }, { shortDescription: pattern }] } }
}

exports.all = cb => {
	getCollection().aggregate([groupByType], cb)
}

exports.getRecipeById = (recipeId, cb) => {
	getCollection().find(ObjectId(recipeId)).next(cb)
}

exports.addRecipe = (data, cb) => {
	getCollection().insertOne(data, cb)
}

exports.getRecipesByLabels = (labels, cb) => {
	getCollection().aggregate([matchLabels(labels), groupByType], cb)
}

exports.getRecipesByFreetext = (freetext, cb) => {
	getCollection().aggregate([matchFreetext(freetext), groupByType], cb)
}

exports.getLabels = cb => {
	getCollection().distinct('labels', cb)
}
