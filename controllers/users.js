const express = require('express');
const router = express.Router();
const Users = require('../models/users');

router.post('/verifyUser', (req, res) => {
	Users.verifyUser(req.body, (err, result) => {
		if (result) {
			res.json({name: result.name});
		} else {
			res.status(401).send('Unknown credentials');
		}
	});
});

router.post('/addUser', (req, res) => {
	Users.addUser(req.body, (err, result) => {
		res.json({success: !err && !!result});
	});
});

module.exports = router;
