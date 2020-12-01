# ElasticSearch Documentation
This information was researched by Ian McDowell from November 2019-May 2020. Contact email: ianmcdowell24@gmail.com
## Definitions:
- Normal Elastic Search (N.ES.): Returns each ElasticSearch document that contains the search term in the ElasticSearch fields and sorts by relevency
- Hydrated Elastic Search (H.ES.): Takes the results of a Normal Elastic Search and finds the document in the Mongo Database to combine all fields 

If you have the content of a book searchable but not the title, the N.ES. would return the content of each document containing the search term, but the H.ES. would return the content and the title.

|  Mongo Term  | ElasticSearch Equivalent |
|:------------:|:------------------------:|
|   Database   |           Index          |
|  Collection  |           Type           |
|      ID      |            ID            |

## Running a joint MongoDB-ElasticSearch database:
- Install ElasticSearch https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html
- Install MongoDB https://docs.mongodb.com/manual/installation/
- Start ElasticSearch in a terminal<br/>
`cd ~/elasticsearch-7.X.X/bin`<br/>
`./elasticsearch`
- Start MongoDB in a terminal<br/>
`mongod (-port 27018)`<br/>
The port change is only needed if the default port (27017) does not work properly

## GUI for Each
- Install ElasticSearch-HQ https://octolinker-demo.now.sh/ElasticHQ/elasticsearch-HQ
- Install MongoDB Compass https://docs.mongodb.com/compass/master/install/
- Start ESHQ in a terminal
`cd ~/elasticsearch-HQ`
`python3 application.py`
- Go to the ElasticSearchHQ GUI in your browser (Default is: http://localhost:5000)
- Connect to your ElasticSearch Cluster (Default is: http://localhost:9200)
- Open MongoDB Compass
- Connect to your database's port

## Operations in MongoDB vs. ElasticSearch

### Deleting a Document from MongoDB:
- Open the MongoDB Compass GUI (See Above)
- Click on the Database that your Document is in
- Click on the Collection that your Document is in
- Find the Document that you wish to delete
- Click the trash can button in the top right of that document
- Click the delete button that appears in the bottom right of that document

### Deleting a Collection from MongoDB
- Open the MongoDB Compass GUI (See Above)
- Click on the Database that your Document is in
- Find the Collection that you wish to delete
- Click the trash can button in the top right of that Collection
- Type the name of the Collection in the pop up window then click delete


### Deleting a Document from ElasticSearch:
-  the ElasticSearch GUI (See Above)
- Click the Query button in top right
- Choose the index that contains the document to be deleted
- Click the blue Query button
- Click the dropdown arrow next to data, then 0, then hits, then hits (again)
- Each of the results under the second hits is a document in the index
- Locate which document you wish to delete by clicking the dropdown arrow next to the Query and checking the _source to verify it is the correct document
- Copy what is shown in the _id field
- To delete that document, run the following command in a new terminal:
`curl -XDELETE 'localhost:9200/[_index]/[_type]/[_id]'`
- Deleting an Index from ElasticSearch:
`curl -XDELETE 'localhost:9200/[_index]'`

## ElasticSearch Queries
### Making a query in Elastic-HQ 

In order to do nested queries, you must have the field mapped as nested when put into ES from Mongo.
The following searches for letters with "Water-Cure" in the body.

Expanded:
``` json
{
	"size": 45,
	"query": {
		"nested": {
			"path": "letters",
			"query": {
				"bool": {
					"must": [
						{ "match": 
							{"letters.docBody": "Water-Cure"}
						}
					]
				}
			},
			"inner_hits" : {}
		}
	}
}
```

Condensed: 
``` {"size": 45,"query": {"nested": {"path": "letters","query": {"bool": {"must": [{ "match": {"letters.docBody": "Water-Cure"}}]}},"inner_hits" : {}}}}```

#### Note about nested queries: inner_hits
With nested queries, an inner_hits field must be specified. If the curly brackets are empty, it will return all results, but if you put a size field inside the curly brackets with an integer value, it will return that many results from a given volume. When there are a large amount of documents to look through, it may be wise to put a size limit on inner hits to prevent long query times.

#### Note about ElasticSearch result scores
When ElasticSearch responds to a query, all of its results include a score value. The higher the score value is, the more relevant a result is to the query. A problem can arise when ElasticSearch returns a set of very relevant results (average scores around 10-12) among a sea of less significant results (average scores around 3-4). While you can filter out results with low scores, it can be difficult if a given query has a low average score. This is an unsolved problem for the CLO Advanced Search, but a theoretical solution could be to perform some sort of statistical analysis on large query responses to find a score threshold for that given query.

### Boolean Queries

in order to make a boolean search, the following are equivalent:

AND:
``` json
"query": {
	"bool": {
		"must": [
			{ "match": 
				{"Field": "Search Term"}
			}
		]
	}
}
```

OR:
``` json
	"query": {
		"bool": {
			"should": [
				{ "match": 
					{"Field": "Search Term"}
				}
			]
		}
	}
```

NOT:
``` json
	"query": {
		"bool": {
			"must_not": [
				{ "match": 
					{"Field": "Search Term"}
				}
			]
		}
	}
```

### match vs. match_phrase
"match" is best used when there is only one word in the search term for a given field. In contrast, "match_phrase" is used if a search term has multiple words or words combined with hyphens (ex: "Frederick the Great" or "Water-Cure").

### Elastic JS Queries

Making queries in elastic JS is almost identical to ElasticHQ, except only the field name and search term are strings 

``` js
query = {
		bool: {
			must: [
				{ match: 
					{"Field": "Search Term"}
				}
			]
		}
	}
```
Nested Query (Note ElasticJS needs the index to be listed for a nested query)
``` js
query = {
	size: 46,
	index: 'volumes',
	body: {
		query: {
			nested: {
				path: "letters",
				query: {
					bool: {
						should: [
							{ match: 
								{ "Field": "Search Term"} 
							}
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
```