var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')


var ExampleSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    status: String
})

ExampleSchema.plugin(mongoosePaginate)
const Example = mongoose.model('Example', ExampleSchema)

module.exports = Example;
