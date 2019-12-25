const Users = require('../models/users')

function hasWriteAccess (req, res, next) {
	if (!req.userId) {
		return res.status(403).send({ auth: false, message: 'No userId provided.' })
	}
	Users.findById(req.userId, (err, user) => {
		if (err) {
			return res.status(500).send({ auth: false, message: 'Failed to identify user.' })
		}
		if (!user || !user.write) {
			return res.status(403).send({ auth: false, message: 'User has no write access' })
		}
		next()
	})
}

module.exports = hasWriteAccess
