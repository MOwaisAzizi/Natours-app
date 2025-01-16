const dotenv = require('dotenv')

dotenv.config({path:'./config.env'})
const mongoose = require('mongoose')
const app = require('./app')

//reading environment varibles,//node uses many envirnment
// console.log(process.env.NODE_ENV);

//express environment
// console.log(app.get('env'));

const DB = process.env.DAtABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
}).then(()=>console.log('successfully connected'))

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        require: [true,'A tour must have a name']
    },
    rating:{
        type: Number,
        default: 4.5
    },
    price:{
        type:Number,
        require:[true,'A tour must have a price'],
    }
})

const Tour = mongoose.model('Tour',{tourSchema})
const testTour = new Tour({
    name:'Forest in the see',
    rating:5.2,
    price:500
})

testTour.save().then(doc=>{
    console.log(doc);
}).catch(err=>{
    console.log('ERROR😂',err);
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})