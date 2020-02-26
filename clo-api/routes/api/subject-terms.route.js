var express = require('express')

var router = express.Router()

// Get subject term controller
var subjectTermController = require('../../controllers/subject-terms.controller')

// Map each API to the controller functions
router.get('/', subjectTermController.getSubjectTerms);
router.get('/vol/:xml_id', subjectTermController.getLetterVolByXML);
router.get('/:xml_id', subjectTermController.getLetter);
router.get('/subject/:subjectSearch', subjectTermController.getSingleSubjectTerm);

// Export router
module.exports = router