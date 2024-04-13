var express = require('express');
var router = express.Router();
const { jwtSecret } = require('../env');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    try {

      const body = { id: req.user.id, email: req.user.email };
      res.json({
        message: 'Signup successfull',
        user: body
      });
    }
    catch (error) {
      next(error);
    }
  }
);
router.post(
  '/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user, info) => {
        try {
          if (err || !user) {
            const error = new Error('An error occurred.');
            console.log("An error occurred",err)
            return next(error);
          }
          console.log("user",user.userId)
          const userDetails = { id: user.id, email: user.email, userGroup: user.userId.map(id => id.userGroup.dataValues.userGroup).flat()};
          console.log("user",userDetails)
          req.login(
            userDetails,
            { session: false },
            async (error) => {
              if (error) return next(error);
              const token = jwt.sign({ user: userDetails }, jwtSecret);
              return res.json({ token });
            }
          );
        }
        catch (error) {
          console.log("An error occurred",error)
          next(error);
        }
      }
    )(req, res, next);
  }
);


module.exports = router;
