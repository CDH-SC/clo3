var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

//model aplication for entry scheme
var Schema = mongoose.Schema;
//Define schema
var entrySchema = new Schema({
  author:       String,
  date:         Date,
  transcriber:  String,
  textTranscribed: String,
  textEditoral: String
});

//Export function to create "Entry" model class
entrySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Entry', entrySchema);
