var ElasticService = require('../services/elastic.services')

_this = this

exports.basicSearch = async function(req, res) {
  var search = req.params.search

  try {
    var results = await ElasticService.basicSearch(search)

    return res.status(200).json({status: 200, data: results, message: 'Successfully performed basic search'})
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message})
  }
}

exports.advancedSearch = async function(req, res) {
  var query = req.params.query;
  try {
    var results = await ElasticService.advancedSearch(query);

    return res.status(200).json({status: 200, data: results, message: 'Successfully performed advanced search'})
  } catch (e) {
    return res.status(400).json({status: 400, message: e.message})
  }
}