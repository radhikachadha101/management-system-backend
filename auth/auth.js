const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const { jwtSecret } = require('../env');
const UserModel = require("../models").User;
const UserGroup = require('../models').UserGroup;
const UserGroupusers = require('../models').UserGroupUsers;
const bcrypt = require("bcrypt");

passport.use(
	'signup',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		async (req, email, password, done) => {
			try {
				const userPayload = { ...req.body, email, password, active: true };
				const user = await UserModel.create(userPayload);
				if (user.dataValues.id && user.dataValues.id > 0) {
					var userGroup = { userGroupId: 1, userId: user.dataValues.id }
					var data = await UserGroupusers.create(userGroup);
				}
				return done(null, user);
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	'login',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email, password, done) => {
			try {
				const user = await UserModel.findOne({
					where: { email, active: true }, include: [{
						model: UserGroupusers, as: 'userId',
						include: [{

							model: UserGroup, as: 'userGroup'
						}]
					}]
				});
				if (!user) {
					return done(null, false, { message: 'User not found' });
				}
				const validate = await bcrypt.compare(password, user.password);
				if (!validate) {
					return done(null, false, { message: 'Wrong Password' });
				}
				return done(null, user, { message: 'Logged in Successfully' });
			} catch (error) {
				return done(error);
			}
		}
	)
);
passport.use(
	new JWTstrategy(
		{
			secretOrKey: jwtSecret,
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
		},
		async (token, done) => {
			try {
				const dbUser = await UserModel.findOne({ where: { email: token.user.email } });
				if (dbUser)
					return done(null, token.user);
				else
					return done('No Such User exist in Database.');

			} catch (error) {
				done(error);
			}
		}
	)
);