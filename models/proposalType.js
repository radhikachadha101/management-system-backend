'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class ProposalType extends Model {

		static associate(models) {
		}
	};
	
	ProposalType.init({
		proposal: {
			type: DataTypes.STRING,
			allowNull: false,
		},
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
		modelName: 'ProposalType',
	  });
	return ProposalType;
};
