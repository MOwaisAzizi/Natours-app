const AppError = require("./../utiles/appError");

const handleCastErrorDB = (err) => {
   const message = `invalid ${err.path}: ${err.value}`;
   return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
   const value = err.keyValue.name;
   const message = `Duplicate field: ${value}. Please use another value.`;
   return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
   if (err.isOperational) {
      res.status(err.statusCode).json({
         status: err.status,
         message: err.message,
         stack: err.stack,
         error: err,
      });
   } else {
      console.log('Error🔥');
      res.status(err.statusCode).json({
         status: 'error',
         message: 'Something went wrong very well!',
      });
   }
};

const sendErrorProd = (err, res) => {
   res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
   });
};

module.exports = ((err, req, res, next) => {
   console.log(err.stack);

   err.statusCode = err.statusCode || 500;
   err.status = err.status || 'error';

   if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
   } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };
      console.log('production environment');

      if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
      if (error.code === 11000) error = handleDuplicateFieldsDB(error);

      sendErrorProd(error, res);
   }
});
