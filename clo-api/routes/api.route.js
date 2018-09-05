var express = require('express')

var router = express.Router()
//require route variables here
var examples = require('./api/example.route')
var volumes = require('./api/volume.route')

//add route modules here
router.use('/examples', examples);
router.use('/volume', volumes);

module.exports = router;
