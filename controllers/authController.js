const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/userModel')
const catchAsycn = require('../utiles/catchAsync')
const AppError = require('../utiles/appError')
const Email = require('../utiles/email')

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id)

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure === 'https'
  }

  res.cookie('jwt', token, cookieOptions)
  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
}

exports.signup = catchAsycn(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const url = `${req.protocol}://${req.get('host')}/me`
  await new Email(newUser, url).sendWelcome()
  createSendToken(newUser, 201, req, res);
})

exports.login = catchAsycn(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new AppError('please provide email and password to login!', 400))
  }

  // +passord: to bring also the paword that we denide to bring it before
  const user = await User.findOne({ email }).select('+password')

  // correct password is a User Schema Method that we made
  if (!user || !await user.correctPassword(password, user.password)) {
    return next(new AppError('incorrect email or password', 401))
  }

  createSendToken(user, 200, req, res)
})

exports.logout = (req, res) => {
  res.cookie('jwt', 'logged out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })

  res.status(200).json({ status: 'success' })
}

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // Verification token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)

      //Check if the user exists
      const currentUser = await User.findById(decoded.id)
      if (!currentUser) {
        return next()
      }

      // Check if user changed password
      if (currentUser.changePasswordAfter(decoded.iat)) {
        return next()
      }

      //this will put a variable in pug file name user
      res.locals.user = currentUser
      return next()
    }

    next()

  } catch (err) {
    return next()
  }
}

exports.protect = catchAsycn(async (req, res, next) => {
  //Geting token and check if its there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(new AppError('You are not logged in! please login to access!', 401))
  }
  
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  //Check if the user exists
  const currentUser = await User.findById(decoded.id)

  if (!currentUser) {
    return next(new AppError('the user belong to this token does not exist anymore', 401))
  }

  // Check if user changed password
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('user recently changed password! please login!'))
  }

  //access to protected rout
  req.user = currentUser;

  //for veiw in pug templete
  res.locals.user = currentUser
  next()
})


exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not permision to to perform an operation on a tour!', 403))
    }

    next()
  }
}

exports.forgotPassword = catchAsycn(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset()

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
      resetURL
    });

  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
})

exports.resetPassword = catchAsycn(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3-update changePasswordAt property for the user

  //4- log the user in, send jwt
  createSendToken(user, 200, req, res)
})


//someone who already loged in!
exports.updatePassword = catchAsycn(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});