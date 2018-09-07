var express = require('express')

var router = express.Router()

// Get volume controller
var volumeController = require('../../controllers/volume.controller')

//Map each API to the controller functions
router.get('/', volumeController.getVolumes)
router.get('/:id', volumeController.getVolumesById)
router.post('/', volumeController.createVolume)
router.put('/', volumeController.updateVolume)
router.delete('/:id', volumeController.removeVolume)

//Export router
module.exports = router
