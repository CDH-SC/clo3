//Accessing the Diary service
var DiaryService = require('../services/diary.services')

//Saving the context of this module inside the _the variable
_this = this


//Async Controller fuction to get diary list
exports.getDiaries = async function(req, res, next){

  //Check the existence of the query parameters, if doesn't exit assign default value
  var page = req.query.page ? req.query.page : 1
  var limit = req.query.limit ? req.query.limit : 10;

  try {
    var diaries = await DiaryService.getDiaries({}, page, limit)

    //Return diaries list with appropriate HTTP status code and message
    return res.status(200).json({status: 200, data: diaries, message: "Successfully recieved diares"});

  }catch(e){
    //Return error response with code and error message
    return res.status(400).json({status: 400, message: e.message});
  }
}

//Async Controller fuction to get diary list by Id
exports.getDiariesById = async function(req, res, next){

  //Require id
  var id = req.params.id;

  try {
    var diaries = await DiaryService.getDiariesById(id)

    //Return diaries list with appropriate HTTP status code and message
    return res.status(200).json({status: 200, data: diaries, message: "Successfully recieved diares"});

  }catch(e){
    //Return error response with code and error message
    return res.status(400).json({status: 400, message: e.message});
  }
}

//Async controller function to create diary
exports.createDiary = async function(req, res, next){

  //Require body contains form values
  var diary = {
    _id: req.body._id,
    date: req.body.date,
    notebook_url: req.body.notebook_url,
    volume_num: req.body.volume_num,
    ms_num: req.body.ms_num,
    page: req.body.page,
  }

  try {
    //Calling service function with new object from request body
    var createdDiary = await DiaryService.createDiary(diary)
    return res.status(201).json({status: 201, data: createdDiary, message: "Successfully created diary"})

  }catch(e){
    //Return error response with code and error message
    return res.status(400).json({status: 400, message: "Diary creation was unsuccessful"})
  }
}

//Async controller function to update diary
exports.updateDiary = async function(req, res, next){
  //Id required for the update
  if(!req.body._id){
    return res.status(400).json({status: 400., message: "Id must be present"})
  }

  var id = req.body._id;
  console.log(req.body)

  var diary = {
    id,
    _id: req.body._id ? req.body._id : null,
    date: req.body.date ? req.body.date : null,
    notebook_url: req.body.notebook_url ? req.body.notebook_url : null,
    volume_num: req.body.volume_num ? req.body.volume_num: null,
    ms_num: req.body.ms_num ? req.body.ms_num: null,
    page: req.body.page ? req.body.page : null,
  }

  try {
    var updatedDiary = await DiaryService.updateDiary(diary)
    return res.status(200).json({status: 200, data: updatedDiary, message: "Successfully updated diary"})

  }catch(e){
    //Return error response with code and error message
    return res.status(400).json({status: 400., message: e.message})
  }
}

//Async controller function to remove diary
exports.removeDiary = async function(req, res, next){
  //Require id
  var id = req.params.id;

  try {
    var deleted = await DiaryService.deleteDiary(id)
    return res.status(204).json({status:204, message: "Successfully deleted diary"})

  }catch(e){
    //Return error response with code and error message
    return res.status(400).json({status: 400, message: e.message})
  }
}
