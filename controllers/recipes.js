const express = require('express')
const router = express.Router()
const Recipes = require('../models/recipes')
const success = { 'success': 'true' }

router.get('/', function (req, res) {
	Recipes.all((err, recipes) => {
		res.json(recipes)
	})
})

router.get('/getRecipeById/', function (req, res) {
	Recipes.getRecipeById(req.query.recipeId, (err, recipe) => {
		res.json(recipe)
	})
})

router.post('/addRecipe', (req, res) => {
	Recipes.addRecipe(req.body, () => res.json(success))
})

router.get('/getRecipesByLabels', (req, res) => {
	Recipes.getRecipesByLabels(req.query.labels, (err, recipes) => res.json(recipes))
})

router.get('/getRecipesByFreetext', (req, res) => {
	Recipes.getRecipesByFreetext(req.query.freetext, (err, recipes) => res.json(recipes))
})

router.get('/getLabels', (req, res) => {
	Recipes.getLabels((err, labels) => res.json(labels.sort()))
})

module.exports = router
