var express = require('express')

var router = express.Router()

// Getting the diary controller
var diaryController = require('../../controllers/diary.controller')

//Map each API to the controller functions
router.get('/', diaryController.getDiaries)
router.get('/:id', diaryController.getDiariesById)
router.post('/', diaryController.createDiary)
router.put('/', diaryController.updateDiary)
router.delete('/:id', diaryController.removeDiary)

//Export the Router
module.exports = router
