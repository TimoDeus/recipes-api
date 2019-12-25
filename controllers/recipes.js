const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Recipes = require('../models/recipes')
const verifyToken = require('../middlewares/verifyToken')
const hasWriteAccess = require('../middlewares/hasWriteAccess')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

const success = { 'success': 'true' }

router.get('/', function (req, res) {
	Recipes.all((err, recipes) => {
		res.json(recipes)
	})
})

router.get('/getRecipeById/', (req, res) => {
	Recipes.getRecipeById(req.query.recipeId, (err, recipe) => {
		res.json(recipe)
	})
})

router.delete('/deleteRecipe/', verifyToken, hasWriteAccess, (req, res) => {
	Recipes.deleteRecipe(req.body._id, (err, recipe) => {
		res.json(recipe)
	})
})

router.patch('/updateRecipe/', verifyToken, hasWriteAccess, (req, res) => {
	Recipes.updateRecipe(req.body._id, req.body, (err, recipe) => {
		res.json(recipe)
	})
})

router.post('/addRecipe', verifyToken, hasWriteAccess, (req, res) => {
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
