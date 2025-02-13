const mongoose = require('mongoose')
const Tour = require('./tourModel')

const reviewSchema = new mongoose.Schema({
    review:{
        type: String,
        required:[true,'A review can not be empty']
    },
    rating:{
        type: Number,
        max:5,
        min:1
    },
    createdAt:{
        type : Date,
        default:Date.now()
    },

    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'A review must belong to a tour']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'A review must belong to a user']
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

//in database just store the id but here we got the id informaiton and show it user
reviewSchema.pre(/^find/,function(next){
    // this.populate({
    //       path:'tour',
    //       select:'name'
    // }).populate({
    //     path:'user',
    //     select:'name photo'
    // })
    // next()
  this.populate({
      path:'user',
      select:'name photo'
  })
  next()
})

reviewSchema.statics.calAverageRatings = async function(tourId){
    //this point to reviewSchem
    const stats = this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
            _id:'$tour',
            nRating:{$some:1},
            aveRating:{$ave:'rating'}
            }
        }
    ])
    await Tour.findByIdAndUpdate(tourId,{
    ratingsAverage : stats[0].aveRating,
    ratingsQuantity : stats[0].nRating
})

}
 reviewSchema.post('save',function(){
    //this.constructor points to Review(we do not have access to Review here)
    this.constructor.calAverageRatings(this.tour)
 })

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review