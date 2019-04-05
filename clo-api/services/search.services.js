var Volume = require('../models/volume.model');

exports.searchVolumes = async function(search) {
    try {
        // Search for whole words
        var searchTerm = new RegExp(
            search.split(" ").map(function(word) {
                return "\\b" + word + "\\b"
            }).join("|")
        );

        // Search parameters
        var pipeline = [
            {
                $match: {
                    $text: { $search: search }
                }
            },
            {
                $unwind: "$letters"
            },
            {
                $match: {
                    "letters.docBody": {$regex: searchTerm, $options: "i"},
                }
            },
            {
                // Set which fields to return from search
                $project: {
                    "_id": 1,
                    "letters.xml_id": 1,
                }
            }
        ];

        var searchResults = await Volume.aggregate(pipeline);
        return searchResults;
    } catch (e) {
        throw Error(e.message, "Error while searching!");
    }
}