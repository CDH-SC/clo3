//Get mongoose model
var Diary = require('./models/diary.model')
var bluebird = require('bluebird')
var mongoose = require('mongoose')
mongoose.Promise = bluebird
mongoose.connect('mongodb://127.0.0.1:27017/mf', { useMongoClient: true})
.then(()=> { console.log(`Succesfully Connected to the Mongodb Database  at URL : mongodb://127.0.0.1:27017/mf`)})
.catch(()=> { console.log(`Error Connecting to the Mongodb Database at URL : mongodb://127.0.0.1:27017/mf`)})
var conn = mongoose.connection;

var base = 'Add_ms_46793_00';
var page = [];
for (i=1; i < 10; i++) {
  page.push(base+String(i)+".jpg");
}

base = 'Add_ms_46793_0';
for(i=10; i < 100; i++) {
  page.push(base+String(i)+".jpg");
}

base = 'Add_ms_46793_';
for(i=100; i <= 488; i++) {
  page.push(base+String(i)+".jpg");
}

var newDiary = new Diary({
  volume_id: 18,
  date: "1904",
  volumeURL: "/images/notebook_18/",
  page: page,
})

conn.collection('diaries').insert(newDiary);
//mongoose.insert(newDiary);
