var express = require('express')
var router = express.Router()

var elasticController = require('../../controllers/elastic.controller')

router.get('/:search', elasticController.basicSearch)
router.get('/advanced-search/:query', elasticController.advancedSearch)

module.exports = router