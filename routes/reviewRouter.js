const express = require('express')
const { restrictTo, protect } = require('../controllers/authController')
const { getAllReview, createReview, deleteReview, updateReview, setTourUserIds, getReview } = require('../controllers/reviewController')

const router = express.Router({ mergeParams: true })

router.use(protect)

router.route('/').get(getAllReview).post(restrictTo('user'), setTourUserIds, createReview)
router.route('/:id').get(getReview).patch(restrictTo('user', 'admin'), updateReview).delete(restrictTo('user', 'admin'), deleteReview)

module.exports = router