var express = require('express')

var router = express.Router()

// Getting the entry controller
var entryController = require('../../controllers/entry.controller')

// Map each API to the controller functions
router.get('/', entryController.getEntries)
router.post('/', entryController.createEntry)
router.put('/', entryController.updateEntry)
router.delete('/:id', entryController.removeEntry)

// Export the router
module.exports = router;
