const User = require('../models/User');
const ErrorResponse = require('../utilis/errorResponse');

//@desc      Register user
//@route     POST /api/v1/auth/register
//@access    Public
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password
  });

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token
  });
};

//@desc      Login user
//@route     POST /api/v1/auth/login
//@access    Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid Credentials', 401));
  }

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token
  });
};