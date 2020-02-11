
// Gettign the Newly created Mongoose Model we just created
var SubjectTerm = require('../models/subject-terms.model')

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the To do List
exports.getSubjectTerms = async function(){

    // Try Catch the awaited promise to handle the error
    try {
        var subjectTerm = await SubjectTerm.find({})

        return subjectTerm;
    } catch(e) {
        throw Error(e.message, 'Error while paginating subject terms')
    }
}
