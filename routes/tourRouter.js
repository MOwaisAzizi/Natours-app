const express = require('express')
const { getAllTours, createTour, getTour, updateTour, deleteTour,aliesTopTours,getTourStats,getMonthlyPlan,getToursWithin, getDistances } = require('../controllers/tourControllers')
const {protect,restrictTo} = require('../controllers/authController')
const reviewRouter = require('../routes/reviewRouter')
// const { createReview } = require('../controllers/reviewController')

const router = express.Router()
// router.param('id', checkID)
//change two middleware functions in post(check body)
// router.route('/').get(getAllTours).post(checkBody, createTour)
//we can use the catchAsycn funtions here in order to send errors in global error handler

//Post: tour/:kdfkde3/reviews
//get: tour/:kdfkde3/reviews
//nested routes:for geting userid and tour id automaticall instead of writing it in body
//the problem with this way is that we have reveiw rout in tour router(not good)
// router.route('/:tourId/reviews').post(protect,restrictTo('user'),createReview)

//whin we redirect the route to another rout we say that execute one the the routs in reviewrouter depentding of request
router.use('/:tourId/reviews',reviewRouter)

router.route('/top-5-cheap').get(aliesTopTours,getAllTours)
router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(protect,restrictTo('admin','lead-guide','guide'),getMonthlyPlan)

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin)
router.route('/distances/:latlng/unit/:unit').get(getDistances)

router.route('/').get(getAllTours).post(protect,restrictTo('admin','lead-guide'),createTour)
router.route('/:id').get(getTour).patch(protect,restrictTo('admin','lead-guide'),updateTour).delete(protect,restrictTo('admin','lead-guide'),deleteTour)

module.exports = router