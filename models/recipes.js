const db = require('../db')
const ObjectId = require('mongodb').ObjectID

const getCollection = () => db.get().collection('recipes')

const groupByType = { $group: { '_id': '$type', recipes: { $push: '$$ROOT' } } }
const notDeleted = { $match: { deleted: { $ne: true } } }
const matchTags = tags => ({ $match: { tags: { $all: tags.split(',') } } })
const matchFreetext = freetext => {
	const pattern = new RegExp(freetext, 'i')
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
	exports.updateRecipe(recipeId, { deleted: true }, cb)
}

exports.updateRecipe = (recipeId, data, cb) => {
	getCollection().updateOne({ _id: ObjectId(recipeId) }, { $set: data }, cb)
}

exports.getRecipesByTags = (tags, cb) => {
	getCollection().aggregate([notDeleted, matchTags(tags), groupByType], cb)
}

exports.getRecipesByFreetext = (freetext, cb) => {
	getCollection().aggregate([notDeleted, matchFreetext(freetext), groupByType], cb)
}

exports.getTags = cb => {
	getCollection().distinct('tags', cb)
}
