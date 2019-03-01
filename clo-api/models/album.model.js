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
      authors: [String],
      date: String,
      genre: String,
      other_titles: String,
      notes: String,
      reproduction_note: String,
      copyright_information: String,
      language_note: String,
      format: String,
    },
  }],
}, { collection: 'albums' })

//Export function to create "Album" model class
albumSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Album', albumSchema);
