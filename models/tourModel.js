const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema(
    //object difinition
    {
    name: {
        type: String,
        require: [true, 'A tour must have a name'],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        require: [true, 'A tour must have a duration'],
    },
    difficulty: {
        type: String,
        require: [true, 'A tour must have a diffeculty'],
    },
    maxGroupSize: {
        type: Number,
        require: [true, 'A tour must have a groupSize'],
    },
    ratingsAverage: {
        type: Number,
        default: 0
    },
    ratingsQuantity: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        require: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    sammary: {
        type: String,
        trim: true,
        require: [true, 'A tour must have a discription'],
    },
    discription: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        require: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    summary: String,
    startDates: [Date]
},
//object for options
{
    toJSON:{virtuals: true},
    toObject:{virtuals: true}
}
)

tourSchema.virtual('durationsWeek').get(function () {
    return this.duration / 7
})

//DOCUMENT middeware pre run before sava() and create() methods
tourSchema.pre('save',function(){
    //this points to current working document
    console.log(this);
})

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour