const express = require('express')
const { getAllTours, createTour, getTour, updateTour, deleteTour, checkID } = require('../controllers/tourControllers')

const router = express.Router()

//   spacial kind of middlware that run in params entered
router.param('id', checkID)

router.route('/').get(getAllTours).post(createTour)
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router