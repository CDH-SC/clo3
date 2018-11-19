var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

//Model for volume schema
var Schema = mongoose.Schema;
//Define schema
var volumeSchema = new Schema({
  _id: String,
  volume_dates: String,
  acknowledgements: String,
  introduction: {
    introText: String,
    introFootnotes: [String],
  },
  letters_to_carlyles: String,
  key_to_references: String,
  chronology: String,
  rival_brothers: String,
  biographicalNote: String,
  inMemoriam: String,
  janeNotebook: String,
  simpleStory: String,
  janeJournal: String,
  geraldineJewsbury: String,
  ellenTwisleton: String,
  athanaeumAdvertisements: String,
  auroraComments: String,
  appendix: String,
  JWCbyTait: String,
  TCbyTait: String,
  letters: [{
    _id: String,
    docDate: String,
    firstPage: String,
    lastPage: String,
    docAuthor: String,
    sender: String,
    recipient: String,
    sourceNote: String,
    head: String,
    docBody: String,
    footnotes: [String],
    // manuscript: [String],
  }],
  accounts: [{
    _id: String,
    docDate: String,
    firstPage: String,
    lastPage: String,
    docAuthor: String,
    sender: String,
    recipient: String,
    sourceNote: String,
    head: String,
    docBody: String,
    footnotes: [String],
  }],
}, { collection: 'volumes'})

//Export function to create "Volume" model class
volumeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Volume', volumeSchema);
