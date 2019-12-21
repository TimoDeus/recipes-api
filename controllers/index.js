const express = require('express');
const router = express.Router();

router.use('/recipes', require('./recipes'));
router.use('/user', require('./users'));

module.exports = router;
