// Accessing the Service that we just created

var ExampleService = require('../services/example.service')

// Saving the context of this module inside the _the variable

_this = this


// Async Controller function to get the To do List

exports.getExamples = async function(req, res, next){

    // Check the existence of the query parameters, If the exists doesn't exists assign a default value

    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;

    try{

        var examples = await ExampleService.getExamples({}, page, limit)

        // Return the examples list with the appropriate HTTP Status Code and Message.

        return res.status(200).json({status: 200, data: examples, message: "Succesfully Recieved Examples"});

    }catch(e){

        //Return an Error Response Message with Code and the Error Message.

        return res.status(400).json({status: 400, message: e.message});

    }
}

exports.createExample = async function(req, res, next){

    // Req.Body contains the form submit values.

    var example = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status
    }

    try{

        // Calling the Service function with the new object from the Request Body

        var createdExample = await ExampleService.createExample(example)
        return res.status(201).json({status: 201, data: createdExample, message: "Succesfully Created Example"})
    }catch(e){

        //Return an Error Response Message with Code and the Error Message.

        return res.status(400).json({status: 400, message: "Example Creation was Unsuccesfull"})
    }
}

exports.updateExample = async function(req, res, next){

    // Id is necessary for the update

    if(!req.body._id){
        return res.status(400).json({status: 400., message: "Id must be present"})
    }

    var id = req.body._id;

    console.log(req.body)

    var example = {
        id,
        title: req.body.title ? req.body.title : null,
        description: req.body.description ? req.body.description : null,
        status: req.body.status ? req.body.status : null
    }

    try{
        var updatedExample = await ExampleService.updateExample(example)
        return res.status(200).json({status: 200, data: updatedExample, message: "Succesfully Updated Tod"})
    }catch(e){
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removeExample = async function(req, res, next){

    var id = req.params.id;

    try{
        var deleted = await ExampleService.deleteExample(id)
        return res.status(204).json({status:204, message: "Succesfully Deleted Example"})
    }catch(e){
        return res.status(400).json({status: 400, message: e.message})
    }

}
