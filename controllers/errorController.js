const AppError = require("../utiles/appError");

const handleCastErrorDB = (err)=>{
   const message = `invalid ${err.path}: ${err.value}`
   return new AppError(message,400)
}

const hanldeDuplicateFieldsDB = (err)=>{
   const message = `invalid ${err.path}: ${err.value}`
   return new AppError(message,400)
}

const sendErrorDev  = (err,res)=>{
   //errors from operations like tacking wrong routs id or so on
  if(err.isOperational){
   res.status(err.statusCode).json({
      status:err.status,
      message:err.message,
      stack:err.stack,
      error:err
   })
  }else{
 //programing Error or unknown error : generic controll
   console.log('Error🔥');
   res.status(err.statusCode).json({
      status:'Error',
      message:'Someting went wrong very well!'
   })
  }
}

const sendErrorProd = (err,res)=>{
   res.status(err.statusCode).json({
      status:err.status,
      message:err.message,
   })
}


module.exports = ((err,req,res,next)=>{
    //for tracing whare error happend
    console.log(err.stack);
    
    err.statusCode = err.statusCode || 500
   err.status = err.status || 'error'

   if(process.env.NODE_ENV === 'developement'){
      sendErrorDev(err,res)
   }
      else if(process.env.NODE_ENV === 'production'){
       let error = {...err}
       //for in inputing wrong id route for geting nice data in production
       if(error.name==='CastError') error = handleCastErrorDB(error)
         if(error.code==='number...') error = hanldeDuplicateFieldsDB(error)

       sendErrorProd(err,res)
      }
})

