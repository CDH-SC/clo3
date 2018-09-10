//Accessing the Volume service
var VolumeService = require('../services/volume.services')

//Saving the context of this module inside the _the variable
_this = this


//Async Controller fuction to get volume list
exports.getVolumes = async function(req, res, next){

  var page = req.query.page ? req.query.page : 1
  var limit = req.query.limit ? req.query.limit : 10;

  try {
    var volumes = await VolumeService.getVolumes({}, page, limit)

    //Return volumes list with appropriate HTTP status code and message
    return res.status(200).json({status: 200, data: volumes, message: "Successfully recieved volumes"});

  }catch(e){
    //Return error response with code and error message
    return res.status(400).json({status: 400, message: e.message});
  }
}

//Async Controller fuction to get volume list by Id
exports.getVolumesById = async function(req, res){

  //Require id
  var id = req.params.id;

  try {
    var volumes = await VolumeService.getVolumesById(id)

    //Return volumes list with appropriate HTTP status code and message
    return res.status(200).json({status: 200, data: volumes, message: "Successfully recieved volumes by id"});

  }catch(e){
    //Return error response with code and error message
    return res.status(400).json({status: 400, message: e.message});
  }
}

//Async controller function to create volume
exports.createVolume = async function(req, res){

  //Require body contains form values
  var volume = {
    _id: req.body._id,
    xml_id: req.body.xml_id,
    volume_id: req.body.volume_id,
  }

  try {
    //Calling service function with new object from request body
    var createdVolume = await VolumeService.createVolume(volume)
    return res.status(201).json({status: 201, data: createdVolume, message: "Successfully created volume"})

  }catch(e){
    //Return error response with code and error message
    return res.status(400).json({status: 400, message: "Volume creation was unsuccessful"})
  }
}

//Async controller function to update volume
exports.updateVolume = async function(req, res){
  //Id required for the update
  if(!req.body._id){
    return res.status(400).json({status: 400., message: "Id must be present"})
  }

  var id = req.body._id;
  console.log(req.body)

  var volume = {
    id,
    _id: req.body._id ? req.body._id : null,
    date: req.body.date ? req.body.date : null,
    notebook_url: req.body.notebook_url ? req.body.notebook_url : null,
    volume_num: req.body.volume_num ? req.body.volume_num: null,
    ms_num: req.body.ms_num ? req.body.ms_num: null,
    page: req.body.page ? req.body.page : null,
  }

  try {
    var updatedVolume = await VolumeService.updateVolume(volume)
    return res.status(200).json({status: 200, data: updatedVolume, message: "Successfully updated volume"})

  }catch(e){
    //Return error response with code and error message
    return res.status(400).json({status: 400., message: e.message})
  }
}

//Async controller function to remove volume
exports.removeVolume = async function(req, res){
  //Require id
  var id = req.params.id;

  try {
    var deleted = await VolumeService.deleteVolume(id)
    return res.status(204).json({status:204, message: "Successfully deleted volume"})

  }catch(e){
    //Return error response with code and error message
    return res.status(400).json({status: 400, message: e.message})
  }
}
