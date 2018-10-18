var express = require('express')

var router = express.Router()

//Get album controller
var albumController = require('../../controllers/album.controller')

//Map each API to the album functions
router.get('/', albumController.getAlbums)
router.get('/:id', albumController.getAlbumsById)

//Export router
module.exports = router
