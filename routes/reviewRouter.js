const express = require('express')

const {getAllReview,createReveiw} = require('../controllers/reviewController')

const router = express.Router()

router.route('/').get(getAllReview).post(createReveiw)

module.exports = router