var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

//model aplication for diary scheme
var Schema = mongoose.Schema;
//Define schema
var diarySchema = new Schema({
  _id:  Number,
  date:       String,
  notebook_url: String,
  volume_num: String,
  ms_num: Number,
  page: [{
    number: Number,
    folio_num: String,
    image: String,
    content: String,
    transcriber: String,
    hand: String,
  }],
}, { _id: false });

//Export function to create "Diary" model class
diarySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Diary', diarySchema);
