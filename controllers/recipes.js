const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const Recipes = require('../models/recipes')
const verifyToken = require('../middlewares/verifyToken')
const hasWriteAccess = require('../middlewares/hasWriteAccess')
const qs = require('qs')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

const success = { 'success': 'true' }

router.get('/', (req, res) => {
	Recipes.all(qs.parse(req.query), (err, recipes) => {
		res.json(recipes)
	})
})

router.get('/getRecipeById/', (req, res) => {
	Recipes.getRecipeById(req.query.recipeId, (err, recipe) => {
		res.json(recipe)
	})
})

router.delete('/deleteRecipe/', verifyToken, hasWriteAccess, (req, res) => {
	Recipes.deleteRecipe(req.body.recipeId, (err, recipe) => {
		res.json(recipe)
	})
})

router.patch('/editRecipe/', verifyToken, hasWriteAccess, (req, res) => {
	Recipes.updateRecipe(req.body, (err, data) => {
		res.json(data)
	})
})

router.post('/addRecipe', verifyToken, hasWriteAccess, (req, res) => {
	Recipes.addRecipe(req.body, () => res.json(success))
})

router.get('/getTags', (req, res) => {
	Recipes.getTags((err, tags) => res.json(tags.sort()))
})

module.exports = router
