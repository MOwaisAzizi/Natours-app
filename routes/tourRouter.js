const express = require('express')
const { getAllTours, createTour, getTour, updateTour, deleteTour,aliesTopTours } = require('../controllers/tourControllers')

const router = express.Router()
// router.param('id', checkID)
//change two middleware functions in post(check body)
// router.route('/').get(getAllTours).post(checkBody, createTour)
router.route('/top-5-cheap').get(aliesTopTours,getAllTours)
router.route('/').get(getAllTours).post(createTour)
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router