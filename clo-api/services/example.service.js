
// Gettign the Newly created Mongoose Model we just created
var Example = require('../models/example.model')

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the To do List
exports.getExamples = async function(query, page, limit){

    // Options setup for the mongoose paginate
    var options = {
        page,
        limit
    }

    // Try Catch the awaited promise to handle the error

    try {
        var examples = await Example.paginate(query, options)

        // Return the exampled list that was retured by the mongoose promise
        return examples;

    } catch (e) {

        // return a Error message describing the reason
        throw Error('Error while Paginating Examples')
    }
}

exports.createExample = async function(example){

    // Creating a new Mongoose Object by using the new keyword
    var newExample = new Example({
        title: example.title,
        description: example.description,
        date: new Date(),
        status: example.status
    })

    try{

        // Saving the Example
        var savedExample = await newExample.save()

        return savedExample;
    }catch(e){

        // return a Error message describing the reason
        throw Error("Error while Creating Example")
    }
}

exports.updateExample = async function(example){
    var id = example.id

    try{
        //Find the old Example Object by the Id

        var oldExample = await Example.findById(id);
    }catch(e){
        throw Error("Error occured while Finding the Example")
    }

    // If no old Example Object exists return false
    if(!oldExample){
        return false;
    }

    console.log(oldExample)

    //Edit the Example Object
    oldExample.title = example.title
    oldExample.description = example.description
    oldExample.status = example.status


    console.log(oldExample)

    try{
        var savedExample = await oldExample.save()
        return savedExample;
    }catch(e){
        throw Error("And Error occured while updating the Example");
    }
}

exports.deleteExample = async function(id){

    // Delete the Example
    try{
        var deleted = await Example.remove({_id: id})
        if(deleted.result.n === 0){
            throw Error("Example Could not be deleted")
        }
        return deleted
    }catch(e){
        throw Error("Error Occured while Deleting the Example")
    }
}
