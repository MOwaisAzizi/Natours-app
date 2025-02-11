const express = require('express')
const  {restrictTo,protect} = require('../controllers/authController')
const {getAllReview,createReview} = require('../controllers/reviewController')

//merge params true means that the crreateRevewu can use the params comming from tourRouter 
const router = express.Router({mergeParams: true})

//Post: tour/:kdfkde3/reviews
//get: tour/:kdfkde3/reviews

router.route('/').get(getAllReview).post(protect,restrictTo('user'),createReview)

module.exports = router