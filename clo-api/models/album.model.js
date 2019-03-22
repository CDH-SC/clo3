var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

//Model for album schema
var Schema = mongoose.Schema;
//Define schema
var albumSchema = new Schema({
  _id: Number,
  imagesFolder: String,
  images: [{
    imageUrl: String,
    metadata: {
      title: String,
      description: String,
      subjects: [String],
      creators: [String],
      date: String,
      media_type: String,
      note: String,
      source: String,
      digital_specs: String,
      date_digital: String,
      rights: String,
      language_note: String,
      format: String,
      publisher: String,
    },
  }],
}, { collection: 'albums' })

//Export function to create "Album" model class
albumSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Album', albumSchema);
