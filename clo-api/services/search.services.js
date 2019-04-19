var Volume = require('../models/volume.model');

exports.searchVolumes = async function(search) {
    try {
        // Search for whole words
        var searchTerm = new RegExp(
            search.split(" ").map(function(word) {
                return "\\b" + word + "\\b";
            }).join("|")
        );

        // Search parameters
        var pipeline = [
            {
                //MongDB match documentation @ https://docs.mongodb.com/manual/reference/operator/aggregation/match/
                //Filter doc stream to only match search terms (reduces loading time)
                $match: {
                    $text: { $search: search }
                }
            },
            {
                //MongoDB unwind documentation @ https://docs.mongodb.com/manual/reference/operator/aggregation/unwind/
                //Deconstruct search term arry to load only specfied objects 
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
                    "letters.docAuthor": 1,
                    "letters.docDate": 1,
                    "letters.docBody": 1
                }
            },
            {
                $sort: {
                    "_id": 1,
                }
            }
        ];

        var searchResults = await Volume.aggregate(pipeline);
        return searchResults;
    } catch (e) {
        throw Error(e.message, "Error while searching!");
    }
};