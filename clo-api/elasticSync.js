// Script Made by Ian McDowell in January 2020

var mongoose = require("mongoose");
var mongoosastic=require("mongoosastic");
var Schema = mongoose.Schema;
require('dotenv').config();

var Letter = new Schema({
  xml_id: {type:String, es_indexed:true},
  docDate: {type:String, es_indexed:true},
  firstPage: {type:String, es_indexed:true},
  lastPage: {type:String, es_indexed:true},
  docAuthor: {type:String, es_indexed:true},
  sender: {type:String, es_indexed:true},
  recipient: {type:String, es_indexed:true},
  sourceNote: {type:String, es_indexed:true},
  head: {type:String, es_indexed:true},
  docBody: {type:String, es_indexed:true},
  footnotes: {type:[String], es_indexed:true}
})

var volumeSchema = new Schema({
  _id: {type:String, es_indexed:true},
  letters: {
    type:[Letter],
    es_indexed: true,
    es_type:'nested',
    es_include_in_parent: true
  },
}, { collection: 'volumes'});

volumeSchema.plugin(mongoosastic);

mongoose.connect(process.env.DB_HOST);

var Volume = mongoose.model('Volume', volumeSchema);

Volume.createMapping(function(err, mapping){
  if(err){
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
    throw 'try again';
  }else{
    console.log('mapping created!');
    console.log(mapping);
    volumeSynchronize();
  }
});

function volumeSynchronize () {
  var stream = Volume.synchronize({}, {saveOnSynchronize: true})
  var count = 0;

  stream.on('data', function(err, doc){
    count++;
  });
  stream.on('close', function(){
    console.log('indexed ' + count + ' documents!');
    throw 'Finished Synchronization';
  });
  stream.on('error', function(err){
    console.log(err);
  });
}