const mongoose = require('mongoose')
const dotenv = require('dotenv')

require('dotenv').config();

//uncaughtException:every sync regection or bugs that is not handled anywhare is run here
//it is top becouse is syncrounouse and cant controll if it were in bottom
process.on('uncaughtException',err =>{
    console.log(err.name,err.message);
    console.log('uncaughtException: server is shoting down...');
    process.exit(1)
})

dotenv.config({path:'./config.env'})
const app = require('./app')

// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
// mongoose.connect(DB,{
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useFindAndModify:true,
//     useUnifiedTopology:true
// }).then(()=>console.log('successfully connected!'))


const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`App listening port ${port}`);
})

//unhandledRejection: every unhandlerd asyc rejection or error(like DB problem with connection) will come to this middleware
process.on('unhandledRejection',err =>{
    console.log(err.name,err.message);
    console.log('unhandledRejection: server is shoting down...');
   //close the server
    server.close(()=>{
        // 1 for rejection 0 is for success we usaually use 1
        //shut down the applicatio
        process.exit(1)
    })
})


//     const testTour = new Tour({
//     name:'Forest in the mountin',
//     price:500
// })

// testTour.save().then(doc=>{
//     console.log(doc);
// }).catch(err=>{
//     console.log('ERROR',err);
// })

//reading environment varibles,//node uses many envirnment
// console.log(process.env.NODE_ENV);

//express environment
// console.log(app.get('env'));