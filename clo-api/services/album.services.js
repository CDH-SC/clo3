//Get mongoose model
var Album = require('../models/album.model')

//Save the context of this module inside the _this variable
_this = this

//Async function to get the Album list
exports.getAlbums = async function(){
  //Try Catch the awaited promise to handle the error
  try {
    var album = await Album.find({})
    return album;
  } catch (e) {
    throw Error(e.message, "Error while paginiating albums")
  }
}

//Async function to get albums by id
exports.getAlbumsById = async function(id){
  //Try Catch the awaited promise to handle the error
  try {
    var album = await Album.findOne({_id: id});
    return album;
  } catch (e) {
    throw Error(e.message, "Error while paginiating albums by id")
  }
}
