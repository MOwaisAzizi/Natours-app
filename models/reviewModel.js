const mongoose = require('mongoose')

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



const Review = mongoose.model('Review', reviewSchema);
module.exports = Review