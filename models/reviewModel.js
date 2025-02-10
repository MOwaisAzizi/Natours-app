const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    reweiw:{
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

    tour:[{
        type:mongoose.Schema.ObjectId,
        ref:'tours',
        required:[true,'A review must belong to a tour']
    }],
    user:[{
        type:mongoose.Schema.ObjectId,
        ref:'users',
        required:[true,'A review must belong to a user']
    }]

})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review