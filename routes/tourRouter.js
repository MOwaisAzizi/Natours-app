const express = require('express')
const { getAllTours, createTour, getTour, updateTour, deleteTour, checkID, checkBody } = require('../controllers/tourControllers')


const router = express.Router()
router.param('id', checkID)
//change two middleware functions in post(check body)
router.route('/').get(getAllTours).post(checkBody, createTour)
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router