const express = require('express')
const  {restrictTo,protect} = require('../controllers/authController')
const {getAllReview,createReview} = require('../controllers/reviewController')

const router = express.Router()

router.route('/').get(getAllReview).post(protect,restrictTo('user'),createReview)

module.exports = router