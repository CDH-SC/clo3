var SearchService = require('../services/search.services');

exports.searchVolumes = async function(req, res) {
    var searchTerm = req.params.searchTerm;
    try {
        var searchResults = await SearchService.searchVolumes(searchTerm);
        return res.status(200).json({
            status: 200,
            data: searchResults,
            message: "Successfully searched volumes."
        });
    } catch (e) {
        // Return error status code with error message
        return res.status(400).json({
            status: 400,
            message: e.message
        });
    }
}