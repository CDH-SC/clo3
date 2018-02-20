//Get mongoose model
var Entry = require('../models/entry.model')

//Saving the context of this module inside the _the variable
_this = this

//Async function to get the entry list
exports.getEntries = async function(query, page, limit){
  //Options setup for mongoose paginate
  var options = {
    page,
    limit
  }

  //Try Catch the awaited promise to handle the error
  try {
    var entries = await Entry.paginate(query, options)

    return entries;

  } catch (e) {
    //Return error message
    throw Error(e.message, "Error while Paginating entries")
  }
}

exports.createEntry = async function(entry){
  //Creating a new mongoose object by using the new keyword
  var newEntry = new Entry({
    author: entry.author,
    date: entry.date,
    transcriber: entry.transcriber,
    textTranscribed: entry.textTranscribed,
    textEditoral: entry.textEditoral
  })

  try {
    var savedEntry = await newEntry.save()
    //Saving the entry
    return savedEntry;
  }catch(e){
    //Return error message
    throw Error(e.message, "Error while creating entry")
  }
}

exports.updateEntry = async function(entry){
  var id = entry.id

  try {
    //Find the old entry object by the id
    var oldEntry = await Entry.findById(id);
  }catch(e){
    throw Error(e.message, "Error occured while finding the entry")
  }

  //If no old entry object exists return false
  if(!oldEntry){
    return false;
  }

  console.log(oldEntry)
  //Edit the entry object
  oldEntry.author = entry.author
  oldEntry.date = entry.date
  oldEntry.transcriber = entry.transcriber
  oldEntry.textTranscribed = entry.textTranscribed
  oldEntry.textEditoral = entry.textEditoral

  console.log(oldEntry)

  try {
    var savedEntry = await oldEntry.save()
    return savedEntry;
  }catch(e){
    throw Error(e.message, "Error occured while updating the entry")
  }
}

exports.deleteEntry = async function(id){
  //Delete the entry
  try{
    var deleted = await Entry.remove({_id: id})
    if(deleted.result.n === 0){
      throw Error(e.message, "Entry could not be deleted")
    }
    return deleted
  }catch(e){
    throw Error(e.message, "Error occured while deleting the entry")
  }
}
