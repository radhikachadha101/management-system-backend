'use strict';
const {
	Model
} = require('sequelize');
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
	class UserGroupUsers extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */ 
		static associate(models) {
			// define association here
			UserGroupUsers.belongsTo(models.UserGroup, {
				foreignKey: "userGroupId",
				as: 'userGroup'
			})
		}
	};
	UserGroupUsers.init({
	
		userGroupId: DataTypes.INTEGER,
		userId: DataTypes.INTEGER,
		createdBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		updatedBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},

		createdBy: DataTypes.INTEGER,
	}, {
		sequelize,
		modelName: 'UserGroupUsers',
		timestamps: true
	});
	return UserGroupUsers;
};
