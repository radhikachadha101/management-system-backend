'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Permission extends Model {

		static associate(models) {
		}
	};
	
	Permission.init({
		permission: {
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
		modelName: 'Permission',
	  });
	return Permission;
};