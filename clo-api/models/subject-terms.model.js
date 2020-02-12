var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var SubjectTermSchema = new mongoose.Schema({
	_id: String,
	xml_ids: [String]
}, { collection: 'subjectterms' })

SubjectTermSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('SubjectTerm', SubjectTermSchema);
