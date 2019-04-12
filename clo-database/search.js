conn = new Mongo();
db = conn.getDB("clo");

db.volumes.createIndex(
    {
        "introduction.introFootnotes": "text",
        "introduction.introText": "text",
        "chronology": "text",
        "letters_to_carlyles": "text",
        "acknowledgements": "text",
        "key_to_references": "text",
        "letters.sourceNote": "text",
        "letters.docBody": "text",
        "letters.docAuthor": "text",
        "letters.recipient": "text",
        "letters.footnotes": "text",
        "volume_dates": "text",
        "frontice_piece.imageCaption": "text"
    }
)

// var search = "hello";

// var searchTerm = new RegExp(
//     search.split(" ").map(function(word) {
//         return "\\b" + word + "\\b"
//     }).join("|")
// );

// pipeline = [
//     {
//         $match: {
//             $text: { $search: search }
//         }
//     },
//     {
//         $unwind: "$letters"
//     },
//     {
//         $match: {
//             "letters.docBody": { $regex: searchTerm, $options: "i" }
//         }
//     },
//     {
//         $project: {
//             "_id": 0,
//             "letters.xml_id": 1,
//             "letters.docBody": 1,
//         }
//     }
// ];

// cursor = db.volumes.aggregate(pipeline);

// while (cursor.hasNext()) {
//     printjson(cursor.next());
// }