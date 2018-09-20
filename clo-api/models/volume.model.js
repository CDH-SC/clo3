var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

//Model for volume schema
var Schema = mongoose.Schema;
//Define schema
var volumeSchema = new Schema({
  _id:        String,
  docDate:    String,
  firstpage:  String,
  lastpage:   String,
  docAuthor:  String,
  sender:     String,
  recipient:  String,
  textClean:  String,
}, { collection: 'volume_1'})

//Export function to create "Volume" model class
volumeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Volume', volumeSchema);
