const mongoose = require('mongoose')
const { default: slugify } = require('slugify')

const tourSchema = new mongoose.Schema(
    //object difinition
    {
    name: {
        type: String,
        require: [true, 'A tour must have a name'],
        unique: true,
        trim: true
    },
    slug:String,
    secretTour:{
        type:String,
        default:false
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

//DOCUMENT middeware: run before or after sava() and create() methods
// tourSchema.pre('save',function(next){
//     //this, points to current working document
//     console.log('this will run before save');
//     this.slug = slugify(this.name,{lower:true})
//     next()
// })

// tourSchema.post('save',function(doc,next){
//    console.log('this will run after save');
//    console.log(doc);
//    next()
// })

//Query middleware:run before queries like find and this points to query object and access to query methods
///^find:means that every query that starts with find(we do this becuse of applying to single find tour too),pre:before,post:after/
//tourSchema.pre('findOne'
tourSchema.pre(/^find/, function(next) {
    //bring all in the find method in controller but process this query after finding your result
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now()
    next();
});

// tourSchema.post(/^find/, function() {
//     console.log(`The operation took ${Date.now() - this.start} milliseconds`);
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour