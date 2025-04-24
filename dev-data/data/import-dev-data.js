const fs = require('fs')
const dotenv = require('dotenv')

dotenv.config({path:'./config.env'})
const mongoose = require('mongoose')
const Tour = require('../../models/tourModel')
const User = require('../../models/userModel')
const Review = require('../../models/reviewModel')

console.log(process.env.DAtABASE);


const DB = process.env.DAtABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
}).then(()=>console.log('successfully connected'))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'))


//import the data to Database
const importData = async()=>{
    try{
        await Tour.create(tours)
        await User.create(users,{validateBeforeSave:false})
        await Review.create(reviews)
        console.log('succefully imported data');
        
    }catch(err){
        console.log(err);
        console.log('❌❌❌❌❌❌❌❌');
    }
    process.exit()
}

//delete Data
const deleteData = async()=>{
    try{
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log('succefully Deleted data');
        
    }catch(err){
        console.log(err);
    }
    process.exit()
}

console.log('😎🤑');
console.log(process.argv);
if(process.argv[2] === '--import'){
    importData()
}else if(process.argv[2] === '--delete'){
     deleteData()
}

