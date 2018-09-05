var express = require('express')

var router = express.Router()

// Getting the Example Controller that we just created

var ExampleController = require('../../controllers/example.controller');


// Map each API to the Controller FUnctions

router.get('/', ExampleController.getExamples)

router.post('/', ExampleController.createExample)

router.put('/', ExampleController.updateExample)

router.delete('/:id',ExampleController.removeExample)


// Export the Router

module.exports = router;
