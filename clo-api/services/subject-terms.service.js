var SubjectTerm = require('../models/subject-terms.model')
var Volume = require('../models/volume.model');

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the To do List
exports.getSubjectTerms = async function() {

  // Try Catch the awaited promise to handle the error
  try {
      var subjectTerm = await SubjectTerm.find({})

      return subjectTerm;
  } catch(e) {
      throw Error(e.message, 'Error while paginating subject terms')
  }
}

exports.getLetterVolByXML = async function(xml_id) {
  try {
      var pipeline = [
          {
              $match: { 'letters.xml_id': xml_id }
          },
          {
              $project: { '_id': 1}
          }
      ];

      var vol = await Volume.aggregate(pipeline);
      return vol;
  } catch(e) {
      throw Error(e.message, 'Error while fetching letter vol');
  }
}

exports.getLetter = async function(xml_id) {
  try {
    var pipeline = [
      {
        $match: { 'letters.xml_id': xml_id }
      },
      {
        $project: {
          letters: {
            $filter: {
              input: '$letters',
              as: 'letter',
              cond: {$eq: ['$$letter.xml_id', xml_id]}
            }
          }
        }
      }
    ];

    var letter = await Volume.aggregate(pipeline);
    return letter;
  } catch(e) {
    throw Error(e.message, 'Error while fetching letter');
  }
}

exports.getSingleSubjectTerm = async function(subjectSearch) {
  try {
    var pipeline = [
      {
        $match: { '_id': subjectSearch }
      }
    ];

    var subjectTerm = await SubjectTerm.aggregate(pipeline);
    return subjectTerm;
  } catch(e) {
    throw Error(e.message, 'Error while fetching subject term');
  }
}