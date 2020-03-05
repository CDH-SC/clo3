var express = require('express')
var router = express.Router()

var elasticController = require('../../controllers/elastic.controller')

router.get('/:search', elasticController.basicSearch)

module.exports = router