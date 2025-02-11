const express = require('express')
const { getAllTours, createTour, getTour, updateTour, deleteTour,aliesTopTours,getTourStats,getMonthlyPlan } = require('../controllers/tourControllers')
const {protect,restrictTo} = require('../controllers/authController')
const {createReview} = require('../controllers/reviewController')

const router = express.Router()
// router.param('id', checkID)
//change two middleware functions in post(check body)
// router.route('/').get(getAllTours).post(checkBody, createTour)
//we can use the catchAsycn funtions here in order to send errors in global error handler
router.route('/top-5-cheap').get(aliesTopTours,getAllTours)
router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)

router.route('/').get(protect,getAllTours).post(createTour)
router.route('/:id').get(getTour).patch(updateTour).delete(protect,restrictTo('admin','lead-guide'),deleteTour)

//nested routes:for geting userid and tour id automaticall instead of writing it in body
router.route('/:tourId/reviews').post(protect,restrictTo('user'),createReview)

module.exports = router