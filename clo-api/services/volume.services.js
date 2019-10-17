//Get mongoose model
var Volume = require('../models/volume.model')

//Saving the context of this module inside the _the variable
_this = this

//Async function to get the Volume list
exports.getVolumes = async function(){

  //Try Catch the awaited promise to handle the error
  try {
    var volume = await Volume.find({})

    return volume;

  } catch (e) {
    //Return error message
    throw Error(e.message, "Error while Paginating volumes")
  }
}

//Async function to get the Volume list by Id
exports.getVolumesById = async function(id){

  //Try Catch the awaited promise to handle the error
  try {
    var volume = await Volume.findOne({_id: id});

    return volume;

  } catch (e) {
    //Return error message
    throw Error(e.message, "Error while Paginating volumes")
  }
}

exports.getVolumesByXML = async function(xml_id){
  try {
    var volume = await Volume.findOne({"letters.xml_id": xml_id}, {"letters.$": 1});

    return volume;

  } catch(e) {
    throw Error(e.message, "Error while Paginating volumes")
  }
}

exports.getAccountByXML = async function(xml_id){
  try {
    var volume = await Volume.findOne({"accounts.xml_id": xml_id}, {"accounts.$": 1});

    return volume;
  } catch(e) {
    throw Error(e.message, "Error while retrieving account")
  }
}

exports.createVolume = async function(volume){
  //Creating a new mongoose object by using the new keyword
  var newVolume = new Volume({
    _id: volume._id,
    date: volume.date,
    notebook_url: volume.notebook_url,
    volume_num: volume.volume_num,
    ms_num: volume.ms_num,
    page: volume.page,
  })

  try {
    var savedVolume = await newVolume.save()
    //Saving the volume
    return savedVolume;
  }catch(e){
    //Return error message
    throw Error(e.message, "Error while creating volume")
  }
}

exports.updateVolume = async function(volume){
  var id = volume.id

  try {
    //Find the old volume object by the id
    var oldVolume = await Volume.findById(id);
  }catch(e){
    throw Error(e.message, "Error occured while finding the volume")
  }

  //If no old volume object exists return false
  if(!oldVolume){
    return false;
  }

  console.log(oldVolume)
  //Edit the volume object
  oldVolume._id = volume._id
  oldVolume.date = volume.date
  oldVolume.notebook_url = volume.notebook_url
  oldVolume.volume_num = volume.volume_num
  oldVolume.ms_num = volume.ms_num
  oldVolume.page = volume.page


  console.log(oldVolume)

  try {
    var savedVolume = await oldVolume.save()
    return savedVolume;
  }catch(e){
    throw Error(e.message, "Error occured while updating the volume")
  }
}

exports.deleteVolume = async function(id){
  //Delete the volume
  try{
    var deleted = await Volume.remove({_id: id})
    if(deleted.result.n === 0){
      throw Error(e.message, "Volume could not be deleted")
    }
    return deleted
  }catch(e){
    throw Error(e.message, "Error occured while deleting the volume")
  }
}
