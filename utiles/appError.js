  
  class AppError extends Error {
      constructor(message,statusCode){
      //this.message = message. not writen becouse the parrent class send the messag dirrectlly in this class
      super(message)
      this.statusCode = statusCode
      this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error'
      this.isOperational = true
      Error.captureStackTrace(this,this.constructor)
    }
  }

  module.exports = AppError