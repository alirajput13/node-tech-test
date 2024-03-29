const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Middleware for verifying JWT token
function verifyToken(req, res, next) {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json({"success": false, "message": 'Access denied'});

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({"success": false, "message": 'Invalid token'});
  }
}

// Validation for user registration
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

// Validation for user login
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

// Validation for profile update
const updateProfileValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6),
    email: Joi.string().min(6).email()
  });
  return schema.validate(data);
};

// Validation for password update
const updatePasswordValidation = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required()
  });
  return schema.validate(data);
};

module.exports = { 
  registerValidation,
  loginValidation,
  verifyToken,
  updateProfileValidation,
  updatePasswordValidation 
};
