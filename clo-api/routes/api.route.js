var express = require('express')

var router = express.Router()
//require route variables here
var examples = require('./api/example.route')
var volume = require('./api/volume.route')
var album = require('./api/album.route')

//add route modules here
router.use('/examples', examples);
router.use('/volume', volume);
router.use('/album', album);

module.exports = router;
