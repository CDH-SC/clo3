// Get mongoose model
const Elastic = require('../models/elastic.model');
const esClient = require('../elasticClient');

// Save the context of this module inside the "_this" variable
_this = this;

exports.basicSearch = async function(search) {
  const query = {
    size: 45,
    index: 'volumes',
    body: {
      query: {
        nested: {
          path: "letters",
          query: {
            bool: {
              should: [
                { match_phrase: { "letters.docBody": search } },
                { match_phrase: { "letters.sourceNote": search } },
                { match_phrase: { "letters.footnotes": search } }
              ]
            }
          },
          inner_hits: {
            size: 10
          }
        }
      }
    }
  }

  try {
    const { body } = await esClient.search(query)
    var results = new Array();
    body.hits.hits.forEach(hit => {
      hit.inner_hits.letters.hits.hits.forEach(inHit => {
        var result = {
          _id: hit._id,
          score: inHit._score,
          terms: search,
          letter: inHit._source
        }
        results.push(result);
      });
    });
    return results
    // return await esClient.search(query);
  } catch (e) {
    throw Error(e.message, "Error using basic Elasticsearch");
  }
};
