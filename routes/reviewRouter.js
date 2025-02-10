const express = require('express')

const {getAllReview,createReveiw} = require('../controllers/reviewController')

const router = express.Router()

router.get('/review',getAllReview).post('/createReview',createReveiw)
