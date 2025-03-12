const AppError = require("./../utiles/appError");

const handleObjectIdDB = (err) => {
   const message = `invalid ${err.path}: ${err.value}`;
   return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
   const value = err.keyValue.name;
   const message = `Duplicate field: ${value}. Please use another value.`;
   return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
   const errors = Object.values(err.errors).map(el=>el.message)
   const message = `Indvalid data. ${errors.join(' .')}`;
   return new AppError(message, 400);
};

const handleJwtError = () => new AppError('Your are not logged in! please login!',401)
const handleJwtExpiredError = () => new AppError('your token has expired! please login again!',401)

const sendErrorDev = (err,req, res,next) => {
   //A)geting some erro thing from API
   if(req.originalUrl.startsWith('/api')){
     //return for doing the if else jon
     return res.status(err.statusCode).json({
         status: err.status,
         message: err.message,
         stack: err.stack,
         error: err,
   })
   }
   //B-Render Website
   //puting wrong name tour in veiw details
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg:err.message
    })
   }

const sendErrorProd = (err,req, res,) => {
  // Operational, trusted error: send message to client(invalid route...)
  //API send message
 if(req.originalUrl.startsWith('/api')){

   if (err.isOperational) {
      return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
   });
}

// Programming or other unknown error: don't leak error details
      return res.status(err.statusCode).json({
      status: err.status,
      message: err,
      details:err.message
   });
 }

 //render website
 //A) operational by AppError
 if(err.isOperational){
   return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg:err.message
    })
   }
// B) none operational
  return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try again later'
    })
}


module.exports = ((err, req, res, next) => {
   err.statusCode = err.statusCode || 500;
   err.status = err.status || 'error';

   if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, req, res);
   } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };

      console.log(err);
      console.log('erororo===============');
      
      console.log(error);
      
      
      if (error.kind === 'ObjectId') error = handleObjectIdDB(error);
      if (error.code === 11000) error = handleDuplicateFieldsDB(error);
      if (error._message === 'Validation failed') error = handleValidationErrorDB(error);

      if (error.name === 'JsonWebTokenError') error = handleJwtError();
      if (error.name === 'TokenExpiredError') error = handleJwtExpiredError();
      
      sendErrorProd(error,req, res);
   }
});
