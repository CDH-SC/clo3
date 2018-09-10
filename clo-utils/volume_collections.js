/*
Title: volume_collections.js
Author: Caleb Kitzmann
*/

// connect to db
db = connect("localhost:27017/clo");

var volume_id = 1;

db.archive_letter.aggregate([
  { $match: { volume_id: volume_id } },
  { $project: {
    _id: "$xml_id",
    docDate: "$docDate",
    firstpage: "$firstpage",
    lastpage: "$lastpage",
    docAuthor: "$docAuthor",
    sender: "$sender",
    recipient: "$recipient",
    textClean: "$textClean",
  } },
  { $out: `volume_${volume_id}` }
]);
