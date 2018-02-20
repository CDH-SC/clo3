//Accessing the Entry service
var EntryService = require('../services/entry.services')

//Saving the context of this module inside the _the variable
_this = this


//Async Controller fuction to get entry list
exports.getEntries = async function(req, res, next){

  //Check the existence of the query parameters, if doesn't exit assign default value
  var page = req.query.page ? req.query.page : 1
  var limit = req.query.limit ? req.query.limit : 10;

  try {
    var entries = await EntryService.getEntries({}, page, limit)

    //Return entries list with appropriate HTTP status code and message
    return res.status(200).json({status: 200, data: entries, message: "Successfully recieved entries"});

  }catch(e){
    //Return error response with code and error message
    return res.status(400).json({status: 400, message: e.message});
  }
}

//Async controller function to create entry
exports.createEntry = async function(req, res, next){

  //Require body contains form values
  var entry = {
    author: req.body.author,
    date: req.body.date,
    transcriber: req.body.transcriber,
    textTranscribed: req.body.textTranscribed,
    textEditoral: req.body.textEditoral
  }

  try {
    //Calling service function with new object from request body
    var createdEntry = await EntryService.createEntry(entry)
    return res.status(201).json({status: 201, data: createdEntry, message: "Successfully created entry"})

  }catch(e){
    //Return error response with code and error message
  }
  return res.status(400).json({status: 400, message: "Entry creation was unsuccessful"})
}

//Async controller function to update entry
exports.updateEntry = async function(req, res, next){
  //Id required for the update
  if(!req.body._id){
    return res.status(400).json({status: 400., message: "Id must be present"})
  }

  var id = req.body._id;
  console.log(req.body)

  var entry = {
    id,
    author: req.body.author ? req.body.author : null,
    date: req.body.date ? req.body.date : null,
    transcriber: req.body.transcriber ? req.body.transcriber : null,
    textTranscribed: req.body.textTranscribed ? req.body.textTranscribed: null,
    textEditoral: req.body.textEditoral ? req.body.textEditoral : null
  }

  try {
    var updatedEntry = await EntryService.updateEntry(entry)
    return res.status(200).json({status: 200, data: updatedEntry, message: "Successfully updated entry"})

  }catch(e){
    //Return error response with code and error message
    return res.status(400).json({status: 400., message: e.message})
  }
}

//Async controller function to remove entry
exports.removeEntry = async function(req, res, next){
  //Require id
  var id = req.params.id;

  try {
    var deleted = await EntryService.deleteEntry(id)
    return res.status(204).json({status:204, message: "Successfully deleted entry"})

  }catch(e){
    //Return error response with code and error message
    return res.status(400).json({status: 400, message: e.message})
  }
}
