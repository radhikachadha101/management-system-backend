'use strict';
const { Model } = require('sequelize');
const bcrypt = require("bcrypt");
const { rounds } = require('../env');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.hasMany(models.UserGroupUsers, {
				foreignKey: "userId",
				as: 'userId'
			})
		}
	};
	User.init({
		firstName: DataTypes.STRING,
		lastName: DataTypes.STRING,
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false
		},
		password: DataTypes.STRING,
		active: DataTypes.BOOLEAN,
		createdBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		updatedBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
		}
	}, {
		hooks: {
			beforeValidate: async (user, options) => {
				if (user.password) {
					var hash = await bcrypt.hash(user.password, rounds);
					user.password = hash
				}
			},
		},
		sequelize,
		modelName: 'User',
		timestamps: true
	});
	return User;
};
