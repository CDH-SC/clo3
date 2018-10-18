//Accessing the album services
var AlbumService = require('../services/album.services')

//Save the context of this module inside the _the variable
_this = this

//Async controller function to get album list
exports.getAlbums = async function(req, res, next){
  try {
    var album = await AlbumService.getAlbums({})

    return res.status(200).json({status: 200, data: album, message: "Successfully recieved albums"});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
}

//Async controller function to get album list by id
exports.getAlbumsById = async function(req, res){
  var id = req.params.id;

  try {
    var album = await AlbumService.getAlbumsById(id)

    return res.status(200).json({status: 200, data: album, message: "Successfully recieved albums by id"});
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message});
  }
}
