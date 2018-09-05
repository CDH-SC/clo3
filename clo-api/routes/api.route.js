var express = require('express')

var router = express.Router()
//require route variables here
var examples = require('./api/example.route')

//add route modules here
router.use('/examples', examples);

module.exports = router;
