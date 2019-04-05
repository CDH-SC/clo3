var express = require('express');

var router = express.Router();

// Getting search controller
var searchController = require('../../controllers/search.controller');

// Mapping each API to the controller functions
router.get('/:searchTerm', searchController.searchVolumes);

module.exports = router;