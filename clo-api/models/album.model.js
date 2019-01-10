var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

//Model for album schema
var Schema = mongoose.Schema;
//Define schema
var albumSchema = new Schema({
  _id: Number,
  albumUrl: String,
  images: [{
    imageUrl: String,
    date: String,
    caption: String,
    title: String,
    creator: String,
  }],
}, { collection: 'albums' })

//Export function to create "Album" model class
albumSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Album', albumSchema);
