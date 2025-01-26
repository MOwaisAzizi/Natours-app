const mongoose = require('mongoose')
const { default: slugify } = require('slugify')

// const tourSchema = new mongoose.Schema(
//     //object difinition
//     {
//         name: {
//             type: String,
//             // required: [true, 'A tour must have a name'],
//             unique: true,
//             trim: true,
//             maxlength: [40, 'A tour name must have less or equal then 40 characters'],
//             minlength: [10, 'A tour name must have more or equal then 10 characters']
//             //validators(requirt is also include)
//         },
//         slug: String,
//         duration: {
//             type: Number,
//             // required: [true, 'A tour must have a duration'],
//         },
//         difficulty: {
//             type: String,
//             // required: [true, 'A tour must have a difficulty'],
//             //validators
//             enum: {
//                 values: ['difficult', 'meduim', 'easy'],
//                 message: 'Difficulty must be either: difficulty, meduim, easy'
//             }
//         },
//         maxGroupSize: {
//             type: Number,
//             // required: [true, 'A tour must have a groupSize'],
//         },
//         ratingsAverage: {
//             type: Number,
//             default: 4.5,
//             min: [1, 'Rating must be above 1.0'],
//             max: [5, 'Rating must be below 5.0']
//         },
//         ratingsQuantity: {
//             type: Number,
//             default: 4.5
//         },
//         price: {
//             type: Number,
//             // required: [true, 'A tour must have a price'],
//         },
//         priceDiscount: {
//             type: Number,
//             //custom validat
//             validate: {
//                 validator: function (val) {
//                     //this points to current document on new creation document not update
//                     return val < this.price
//                 },
//                 message: 'Discount ({VALUE}) must be less then price'
//             }
//         },
//         sammary: {
//             type: String,
//             trim: true,
//             // required: [true, 'A tour must have a discription'],
//         },
//         discription: {
//             type: String,
//             trim: true
//         },
//         imageCover: {
//             type: String,
//             // required: [true, 'A tour must have a cover image'],
//         },
//         images: [String],
//         createdAt: {
//             type: Date,
//             default: Date.now(),
//             select: false
//         },
//         summary: String,
//         startDates: [Date],
//         secretTour: {
//             type: Boolean,
//             default: false
//         }
//     },

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [40, 'A tour name must have less or equal then 40 characters'],
            minlength: [10, 'A tour name must have more or equal then 10 characters']
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['difficult', 'medium', 'easy'],
                message: 'Difficulty must be either: difficult, medium, easy'
            }
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0']
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price;
                },
                message: 'Discount price ({VALUE}) should be below the regular price'
            }
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summary']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    },
    //objects for options
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

tourSchema.virtual('durationsWeek').get(function () {
    return this.duration / 7
})

//DOCUMENT middeware: run before or after sava() and create() methods
tourSchema.pre('save', function (next) {
    //this, points to current working document
    console.log('saving===😍🤑🤑😍😍😍==');
    
    console.log(this);
    // this.slug = slugify(this.name,{lower:true})
    next()
})

// tourSchema.post('save',function(doc,next){
//    console.log('this will run after save');
//    console.log(doc);
//    next()
// })

//Query middleware:run before queries like find and this points to query object and access to query methods
///^find:means that every query that starts with find(we do this becuse of applying to single find tour too),pre:before,post:after/
//we can use tourSchema.pre('findOne') for single find
// tourSchema.pre(/^find/, function(next) {
//     //bring all in the find method in controller but process this query after finding your result
//     this.find({ secretTour: { $ne: true } });
//     this.start = Date.now()
//     next();
// });

// tourSchema.post(/^find/, function() {
//     console.log(`The operation took ${Date.now() - this.start} milliseconds`);
// });

//3-Agregate middleware: becuse when filtering the secret tour in find method the aggregate request alse filter it we use this
tourSchema.pre('aggregate', function (next) {
    console.log('This is aggregate');
    // Add a $match stage to filter out secret tours
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    this.start = Date.now();
    next()
});

tourSchema.post('aggregate', function () {
    console.log('This is finish');
    console.log(`The time took ${Date.now() - this._start} ms`);
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour