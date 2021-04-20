// Get mongoose model
const Elastic = require('../models/elastic.model');
const esClient = require('../elasticClient');

// Save the context of this module inside the "_this" variable
_this = this;

exports.basicSearch = async function(search) {
  const query = {
    size: 46,
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


exports.advancedSearch = async function(query) {
  var andArray = [];
  var orArray = [];
  var notArray = [];
  var result = query.split("_");
  var mode = [false,false,false]; //andMode, orMode, notMode


  console.log(result);

  for(var i = 0; i < result.length; i++) {
    if(result[i] == '') {
      continue;
    }
    if(result[i].includes("$AND:")) {
      mode = [true,false,false];
      continue;
    } else if(result[i].includes("$OR:")) {
      mode = [false,true,false];
      continue;
    } else if(result[i].includes("$NOT:")) {
      mode = [false,false,true];
      continue;
    }

    var info = result[i].split("-");
    var fieldName = "letters." + info[0];

    if(mode[0]) {
    // these values need to be assigned to an identifier to later be used in the a filter's property, which is declared after the loop
     if (fieldName.includes("docDate")) {
        if (fieldName.includes("Min")) {
          minYear = info[1];
          continue;
        }
        else if (fieldName.includes("Max")) {
          maxYear = info[1];
          continue;
        }
      }
      console.log(fieldName);
      var match_phrase = {};
      match_phrase[fieldName] = info[1];
      andArray.push({
        match_phrase
     });
    } else if(mode[1]) {
      var match_phrase = {};
      match_phrase[fieldName] = info[1];
      orArray.push({
        match_phrase
      });
    } else if(mode[2]) {
      var match_phrase = {};
      match_phrase[fieldName] = info[1];
      notArray.push({
        match_phrase
      });      
    }
  }

  var dateFilter = [
                    {range: 
                      { "letters.docDate":
                          {gte: minYear, lte: maxYear}}
                      }
                    ];

  var rawQueryObject = {
      filter: dateFilter,
      must: andArray, 
      should: orArray,
      must_not: notArray
    };
  // console.log("and",andArray);
  // console.log("or",orArray);
  // console.log("not",notArray);
  var queryObject = {
    size: 46,
    index: 'volumes',
    body: {
      query: {
        nested: {
          path: "letters",
          query: {
            bool: rawQueryObject,
          },
          inner_hits : {
            size: 10
          }
        }
      }
    }
  };
  try {
    console.log("qObject",JSON.stringify(queryObject));
    const { body } = await esClient.search(queryObject)
    var results = new Array();
    body.hits.hits.forEach(hit => {
      hit.inner_hits.letters.hits.hits.forEach(inHit => {
        var result = {
          _id: hit._id,
          score: inHit._score,
          terms: query,
          letter: inHit._source
        }
        // if (inHit._score > 4) { // Score Threshold (Unsure what the value should be because certain queries have lower average scores)
          results.push(result);
        // }
      });
    });
    console.log("results",results);
    return results
  } catch (e) {
    throw Error(e.message, "Error using advanced Elasticsearch");
  }
}