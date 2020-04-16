require('dotenv').config();

// Connect to Elasticsearch cluster
const es = require('@elastic/elasticsearch');
const esClient = new es.Client({
  node: process.env.ES_HOST
});

module.exports = esClient;