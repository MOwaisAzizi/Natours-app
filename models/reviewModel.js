const mongoose = require('mongoose')
const Tour = require('./tourModel')

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'A review can not be empty']
  },
  rating: {
    type: Number,
    max: 5,
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },

  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'A review must belong to a tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A review must belong to a user']
  }
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  })
  next()
})

reviewSchema.statics.calAverageRatings = async function (tourId) {
  //this point to reviewSchem
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ])
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calAverageRatings(this.tour)
})

reviewSchema.pre(/findOneAnd/, async function (next) {
  this.r = await this.findOne()
  next()
})

reviewSchema.post(/findOneAnd/, async function () {
  if (this.r) {
    await this.r.constructor.calAverageRatings(this.r.tour)
  }
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review