'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Countries extends Model {

		static associate(models) {
		}
	};
	
	Countries.init({
		countryName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        code: {
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
		modelName: 'Countries',
	  });
	return Countries;
};
