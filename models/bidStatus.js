'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class BidStatus extends Model {

		static associate(models) {
		}
	};
	
	BidStatus.init({
		status: {
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
		modelName: 'BidStatus',
	  });
	return BidStatus;
};
