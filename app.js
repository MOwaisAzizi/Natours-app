const express = require('express')
const path = require('path')
const morgan = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoSantization = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const userRouter = require('./routes/userRouter')
const tourRouter = require('./routes/tourRouter')
const reviewRouter = require('./routes/reviewRouter')
const AppError = require('./utiles/appError')
const globalErrorHandler = require('./controllers/errorController')

const app = express()

//templet engin to send out templete to cient
app.set('veiw engine', 'pug')
//path.join is for providing a dinamic path(adding or deleting / before routes)
app.set(path.join(__dirname,'views'))

//our global Middlwares

  //reading static files
  app.use(express.static(`${__dirname}/public`))

//////SECURITY MIDDLWARES(pakages)
//set security http header
app.use(helmet())

//development logging 
//this is for just shoing the morgan(to show some states of requst like request or success.....) whin the app is runing
if(process.env.NODE_ENV === 'development') app.use(morgan('dev'))
  
  //limit requests form same api
  const limitRater = rateLimit({
    max:100,
    windowMs:60 * 60 * 1000,
    message:'To many request of this IP. please try agin in an hour!'
  })
  //api means every links that starts with api run this middlware
  app.use('/api',limitRater)
  
  //body parser, reading data from body into req.body
  //10kb means not allwod data form body more then 10kb
  app.use(express.json({limit:'10kb'}))

 // data sanitiazation against nosql query injection.(email:$gt:'': it is working to provide email to true)
  app.use(mongoSantization())

 //data sinitaion against ssl(prevent to name a stirng a bad html code and store bad data in database)
 app.use(xss())

//preventing parmamters polution(whin we writing mult parms value like sort=price&sort=age)
//in some cases it needs to be muiltivalue(like defeculty=easy&defeculty=miduim)
app.use(hpp({
  whitelist : ['duration','difficulty','maxGroupSize','ratingsAverage','ratingsQuantity']
}))


  //route middlware
//after execution this middleware end the responing to client
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

//whin we write a middleware that has four arguments that means that is an error handling middlwware not regular one
app.all('*',(req,res,next)=>{
   next(new AppError(`not fount ${req.originalUrl} path in this sever!`,404))
  })

app.use(globalErrorHandler)


// whin no url match to top routes this middlware will run and send back a message for all wrong urls
// app.all('*',(req,res,next)=>{
//     res.status(404).json({
//         status:'fail',
//         message:`not fount ${req.originalUrl} in this sever!`
//     }) 
// })
// app.all('*',(req,res,next)=>{
//   const err = new Error(`not fount ${req.originalUrl} in this sever!`)
//   err.status = 'fail'
//   err.statusCode = 404
//   //whin we pass err in next express will know that the input is an error so it ignore all the middlwares and go to error handling middlware
//   next(err)
// })
// app.use((err,req,res,next)=>{
//      err.statusCode = err.statusCode || 500
//     err.status = err.status || 'error'
//     res.status(err.statusCode).json({
//        status:err.status,
//        message:err.message,
//     })
//  })

module.exports = app

