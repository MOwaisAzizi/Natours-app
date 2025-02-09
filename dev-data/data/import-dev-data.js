const fs = require('fs')
const dotenv = require('dotenv')

dotenv.config({path:'./config.env'})
const mongoose = require('mongoose')
const Tour = require('../../models/tourModel')

const DB = process.env.DAtABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
}).then(()=>console.log('successfully connected'))

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'))

//import the data to Database
const importData = async()=>{
    try{
        await Tour.create(tours)
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
        console.log('succefully Deleted data');

    }catch(err){
        console.log(err);
    }
    process.exit()
}

console.log(process.argv);
if(process.argv[2] === '--import'){
    importData()
}else if(process.argv[2] === '--delete'){
     deleteData()
}

