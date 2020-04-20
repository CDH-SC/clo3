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

exports.getLetterVolByXML = async function(req, res) {
	var xml_id = req.params.xml_id;
	try {
		var vol = await SubjectTermService.getLetterVolByXML(xml_id);
		return res.status(200).json({status: 200, data: vol, message: 'Successfully retrieved letter'});
	} catch(e) {
		return res.status(400).json({status: 400, message: e.message});
	}
}

exports.getLetter = async function(req, res) {
	var xml_id = req.params.xml_id;
	try {
		var letter = await SubjectTermService.getLetter(xml_id);
		return res.status(200).json({status: 200, data: letter, message: 'Successfully retrieved letter'});
	} catch(e) {
		return res.status(400).json({status: 400, message: e.message});
	}
}

exports.getSingleSubjectTerm = async function(req, res) {
	var subjectSearch = req.params.subjectSearch;
	try {
		var subjectTerm = await SubjectTermService.getSingleSubjectTerm(subjectSearch);
		return res.status(200).json({status: 200, data: subjectTerm, message: 'Successfullly retrieved subject term'});
	} catch(e) {
		return res.status(400).json({status: 400, message: e.message});
	}
}