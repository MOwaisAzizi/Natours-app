const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        require: [true,'A tour must have a name'],
        unique:true,
        trim:true
    },
    duration:{
        type:Number,
        require: [true,'A tour must have a duration'],
    },
    difficulty:{
        type:String,
        require: [true,'A tour must have a diffeculty'],
    },
    maxGroupSize:{
        type:Number,
        require: [true,'A tour must have a groupSize'],
    },
    ratingAverage : {
        type: Number,
        default: 0
    },
    ratingQuantity:{
        type: Number,
        default: 4.5
    },
    price:{
        type:Number,
        require:[true,'A tour must have a price'],
    },
    priceDiscount:Number,
    sammary:{
        type:String,
        trim:true,
        require:[true,'A tour must have a discription'],
    },
    discription:{
        type:String,
       trim:true
    },
     imageCover:{
        type:String,
        require:[true,'A tour must have a cover image'],
     },
     images:[String],
     createdAt:{
        type : Date,
        default:Date.now()
    },
     startDatas:[Date]
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour