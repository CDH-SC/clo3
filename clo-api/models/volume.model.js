var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

//Model for volume schema
var Schema = mongoose.Schema;
//Define schema
var volumeSchema = new Schema({
  _id: String,
  volume_dates: String,
  acknowledgements: {
    body: String,
    footnotes: [String],
  },
  introduction: {
    body: String,
    footnotes: [String],
  },
  letters_to_carlyles: String,
  key_to_references: String,
  chronology: String,
  rival_brothers: {
    body: String,
    footnotes: [String],
  },
  biographicalNote: String,
  inMemoriam: String,
  janeNotebook: {
    body: String,
    footnotes: [String],
  },
  simpleStory: {
    body: String,
    footnotes: [String],
  },
  janeJournal: {
    body: String,
    footnotes: [String],
  },
  geraldineJewsbury: {
    body: String,
    footnotes: [String],
  },
  ellenTwisleton: {
    body: String,
    footnotes: [String],
  },
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
volumeSchema.index({'$**':'text'});
volumeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Volume', volumeSchema);
