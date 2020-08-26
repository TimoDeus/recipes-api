const db = require('../db')
const ObjectId = require('mongodb').ObjectID

const getCollection = () => db.get().collection('recipes')

const groupByType = { $group: { '_id': '$type', recipes: { $push: '$$ROOT' } } }
const notDeleted = { $match: { deleted: { $ne: true } } }
const matchTags = tags => ({ $match: { tags: { $all: tags } } })
const matchQuery = query => {
	const pattern = new RegExp(query, 'i')
	return { $match: { $or: [{ title: pattern }, { shortDescription: pattern }] } }
}
const matchNormalizedTitle = query => ({ $match: { normalizedTitle: new RegExp(query, 'i') } })
const sortByTitle = { $sort: { normalizedTitle: 1 } }

exports.all = (queryParams, cb) => {
	const pipeline = []
	pipeline.push(notDeleted)
	if (queryParams.query) {
		pipeline.push(matchQuery(queryParams.query))
	}
	if (queryParams.tags) {
		let { tags = [] } = queryParams
		if (!Array.isArray(tags)) {
			tags = [tags]
		}
		pipeline.push(matchTags(tags))
	}
	pipeline.push(sortByTitle)
	pipeline.push(groupByType)
	getCollection().aggregate(pipeline).toArray(cb)
}

exports.getRecipeByTitle = (title, cb) => {
	getCollection().aggregate([notDeleted, matchNormalizedTitle(title)]).next(cb)
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
