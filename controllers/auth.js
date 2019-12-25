const Users = require('../models/users')
const verifyJwtToken = require('../middlewares/verifyToken')
const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const router = express.Router()
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

const DEFAULT_EXPIRATION = 86400 // 24 hours

router.post('/register', function (req, res) {

	const hashedPassword = bcrypt.hashSync(req.body.password, 8)

	Users.addUser({
		name: req.body.name,
		password: hashedPassword
	}, function (err, user) {
		if (err) {
			return res.status(500).send('There was a problem registering the user.')
		}
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: DEFAULT_EXPIRATION
		})
		res.status(200).send({ auth: true, token })
	})
})

router.post('/login', function (req, res) {

	Users.findByName(req.body.name, (err, user) => {
		if (err) {
			return res.status(500).send('Error on the server.')
		}

		if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
			return res.status(401).send({ auth: false, token: null })
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: DEFAULT_EXPIRATION
		})

		res.status(200).send({ auth: true, token })
	})
})

router.get('/me', verifyJwtToken, function (req, res) {
	res.status(200).send({ success: 'success' })
})

module.exports = router
