/*
Title: volume_collections.js
Author: Caleb Kitzmann
*/

// connect to db
db = connect("localhost:27017/clo");

var volume_id = 1;

db.archive_letter.aggregate([
  {$match: { volume_id: volume_id } }, { $out: `volume_${volume_id}` }
]);
