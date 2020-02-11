// Accessing the SubjectTerm service
var SubjectTermService = require('../services/subject-terms.service')

// Saving the context of this module inside the _the variable
_this = this

// Async controller function to get the volume list
exports.getSubjectTerms = async function(req, res, next) {
	try {
		var subjectTerm = await SubjectTermService.getSubjectTerms({})

		// Return subject terms list with appropriate HTTP status code and message
		return res.status(200).json({status: 200, data: subjectTerm, message: 'Successfully retrieved subject terms'});
	} catch(e) {
		return res.status(400).json({status: 400, message: e.message});
	}
}