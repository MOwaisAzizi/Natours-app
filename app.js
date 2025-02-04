const express = require('express')

const app = express()
const morgan = require('morgan')
const userRouter = require('./routes/userRouter')
const tourRouter = require('./routes/tourRouter')
const AppError = require('./utiles/appError')
const globalErrorHandler = require('./controllers/errorController')


app.use(express.json())
//this is for just shoing the morgan(to show some states of requst like request or success.....) whin the app is runing
if(process.env.NODE_ENV === 'development') app.use(morgan('dev'))

//after execution this middleware end the responing
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

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

