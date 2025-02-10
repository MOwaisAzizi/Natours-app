const mongoose = require('mongoose')

const rewiewSchema = new mongoose.Schema({
    reweiw: String,
    rating:{
        type:String,
        default:0
    },
    createdAt:Date,

    refTour:[{
        type:mongoose.Schema.ObjectId,
        ref:'tours'
    }],
    refUser:[{
        type:mongoose.Schema.ObjectId,
        ref:'users'
    }]

})