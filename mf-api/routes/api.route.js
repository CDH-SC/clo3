var express = require('express')

var router = express.Router()
//require route variables here
var diaries = require('./api/diary.route')
var entries = require('./api/entry.route')

//add route modules here
router.use('/diaries', diaries);
router.use('/entries', entries)


module.exports = router;
