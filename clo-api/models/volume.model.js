var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

//Model for volume schema
var Schema = mongoose.Schema;
//Define schema
var volumeSchema = new Schema({
  _id:        Schema.Types.ObjectId,
  xml_id:     String,
  volume_id:  Number,
  docDate:    String,
  firstpage:  String,
  lastpage:   String,
  docAuthor:  String,
  sender:     String,
  recipient:  String,
  sourceNote: String,
  textClean:  String,
  next_id:    String,
  prev_id:    String,
})

//Export function to create "Volume" model class
volumeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Volume', volumeSchema);
