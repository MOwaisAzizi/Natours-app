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

const sendErrorDev = (err, res) => {
      res.status(err.statusCode).json({
         status: err.status,
         message: err.message,
         stack: err.stack,
         error: err,
   })
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client(invalid route...)
   if (err.isOperational) {
   res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
   });
    // Programming or other unknown error: don't leak error details
} else {
   res.status(err.statusCode).json({
      status: err.status,
      message: 'someting went wrong',
   });
}
};

module.exports = ((err, req, res, next) => {
   err.statusCode = err.statusCode || 500;
   err.status = err.status || 'error';

   if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
   } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };
      
      if (error.kind === 'ObjectId') error = handleObjectIdDB(error);
      if (error.code === 11000) error = handleDuplicateFieldsDB(error);
      if (error._message === 'Validation failed') error = handleValidationErrorDB(error);

      if (error.name === 'JsonWebTokenError') error = handleJwtError();
      if (error.name === 'TokenExpiredError') error = handleJwtExpiredError();
      
      sendErrorProd(error, res);
   }
});
