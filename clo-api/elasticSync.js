// Script Made by Ian McDowell in January 2020

var mongoose = require("mongoose");
var mongoosastic=require("mongoosastic");
var Schema = mongoose.Schema;
require('dotenv').config();
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: process.env.ES_HOST })

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
    // Converts all XML to string when put into elasticsearch database
    Volume.find(function(err, allvolumes, count) {
      console.log(allvolumes.length);
      var volumes = []
      for(i = 0; i < allvolumes.length; i++) {

        var volume = {
          _id: parseInt(allvolumes[i]._id)
        };
        console.log(volume["_id"]);

        var letters = [];

        for(j = 0; j < allvolumes[i].letters.length; j++) {
          letter = {
            xml_id: allvolumes[i].letters[j].xml_id,
            docDate: allvolumes[i].letters[j].docDate,
            firstPage: allvolumes[i].letters[j].firstPage,
            lastPage: allvolumes[i].letters[j].lastPage,
            docAuthor: allvolumes[i].letters[j].docAuthor,
            sender: allvolumes[i].letters[j].sender,
            recipient: allvolumes[i].letters[j].recipient,
          };

          if(allvolumes[i].letters[j].sourceNote){
            var fixedSource = allvolumes[i].letters[j].sourceNote.toString().replace(/<[^>]*>/g, '');
            letter["sourceNote"] = fixedSource.replace(/\n/g, '');
          } else {
            letter["sourceNote"] = "";
          }
          bodyString = allvolumes[i].letters[j].docBody.toString().replace(/[0-9]<\/a>/g,'')
          bodyString = bodyString.replace(/<[^>]*>/g, '');
          bodyString = bodyString.replace(/\n/g, '');
          letter["docBody"] = bodyString;
          
          var footnotes = [];
          if(allvolumes[i].letters[j].footnotes) {            
            for(k = 0; k < allvolumes[i].letters[j].footnotes.length; k++) {
              footnotes.push(allvolumes[i].letters[j].footnotes[k].toString().replace(/<[^>]*>/g, '').replace(/\n/g, ''));
            }
          }
          letter["footnotes"] = footnotes;
          letters.push(letter);
        }
        volume["letters"] = letters;
        volumes.push(volume);
      }
      volumeSynchronize(volumes);
    });
  }
});

function volumeSynchronize (volumes) {
  var stream = Volume.synchronize({}, {saveOnSynchronize: true})
  var count = 0;

  stream.on('data', function(err, doc){
    count++;
    currVol = getVolume(doc._id,volumes);
    doc.letters = currVol.letters;
    doc.save(function(err) {
      if(err) {
        console.log("error: ", err);        
      }
    });
  });
  stream.on('close', function(){
    console.log('indexed ' + count + ' documents!');
    throw 'Finished Synchronization';
  });
  stream.on('error', function(err){
    console.log(err);
  });
}

function getVolume(volID, volumes) {
  for(var i = 0; i < volumes.length; i++) {
    if(volumes[i]._id == volID) {
      return volumes[i];
    }
  }
}