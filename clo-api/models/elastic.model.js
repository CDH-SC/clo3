var mongoose = require("mongoose");
var mongooastic = require("mongoosastic");
var app = require("../app");

var Schema = mongoose.Schema;

var elasticLetterSchema = new Schema({
  xml_id: { type: String, es_indexed: true },
  docDate: { type: String, es_indexed: true },
  firstPage: { type: String, es_indexed: true },
  lastPage: { type: String, es_indexed: true },
  docAuthor: { type: String, es_indexed: true },
  sender: { type: String, es_indexed: true },
  recipient: { type: String, es_indexed: true },
  sourceNote: { type: String, es_indexed: true },
  head: { type: String, es_indexed: true },
  docBody: { type: String, es_indexed: true },
  footnotes: { type: [String], es_indexed: true }
});

var elasticVolumeSchema = new Schema(
  {
    _id: { type: String, es_indexed: true },
    letters: {
      type: [elasticLetterSchema],
      es_indexed: true,
      es_type: "nested",
      es_include_in_parent: true
    }
  },
  { collection: "volumes" }
);

elasticVolumeSchema.plugin(mongooastic, {
  esClient: app.esClient
});
module.exports = mongoose.model("Elastic", elasticVolumeSchema);
