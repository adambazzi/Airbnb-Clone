const express = require('express')
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('firstName')
    .notEmpty()
    .withMessage("First Name is required"),
  check('lastName')
    .notEmpty()
    .withMessage("Last Name is required"),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

router.post(
    '/',
    validateSignup,
    async (req, res, next) => {
      const { email, password, username, firstName, lastName } = req.body;

      const errors = {}
      const emailCheck = await User.findAll({
        where: {
          email: email
        }
      })
      const usernameCheck = await User.findAll({
        where: {
          username: username
        }
      })
      //verifies if username or email exists
      if (emailCheck.length) errors.email = "User with that email already exists"
      if (usernameCheck.length) errors.username = "User with that username already exists"
      if (Object.keys(errors).length) {
        const error = new Error("User already exists");
        error.status = 403;
        error.errors = errors
        return next(error)
      }

      const user = await User.signup({ email, username, password, firstName, lastName });

      const token = await setTokenCookie(res, user);

      return res.json({
        ...user.toJSON(),
        token: token
      });
    }
);

module.exports = router;
