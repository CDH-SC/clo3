var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var SubjectTermSchema = new mongoose.Schema({
	_id: String,
	xml_ids: [String]
})

SubjectTermSchema.plugin(mongoosePaginate)
const SubjectTerm = mongoose.model('SubjectTerm', SubjectTermSchema)

module.exports = SubjectTerm;
