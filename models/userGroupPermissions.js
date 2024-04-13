'use strict';
const {
	Model
} = require('sequelize');
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
	class UserGroupPermission extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */ 
		static associate(models) {
			// define association here
			UserGroupPermission.belongsTo(models.UserGroup, {
				foreignKey: "userGroupId",
				as: 'userGroup'
			}),
            UserGroupPermission.belongsTo(models.Route, {
				foreignKey: "routeId",
				as: 'route'
			}),
			UserGroupPermission.belongsTo(models.Permission, {
				foreignKey: "permissionId",
				as: 'permission'
			})
		}
	};
	UserGroupPermission.init({
	
		userGroupId: DataTypes.INTEGER,
		routeId: DataTypes.INTEGER,
        permissionId: DataTypes.INTEGER,
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
		modelName: 'UserGroupPermission',
		timestamps: true
	});
	return UserGroupPermission;
};
