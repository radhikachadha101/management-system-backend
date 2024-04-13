'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class UserGroup extends Model {

		static associate(models) {
		}
	};
	
	UserGroup.init({
		userGroup: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		active: DataTypes.BOOLEAN,
		createdBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		updatedBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
		}
	},{
		sequelize,
		timestamps: true,
		modelName: 'UserGroup',
	  });
	return UserGroup;
};
