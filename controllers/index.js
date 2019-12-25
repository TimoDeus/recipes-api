const express = require('express');
const router = express.Router();

router.use('/recipes', require('./recipes'));
router.use('/auth', require('./auth'));

module.exports = router;
