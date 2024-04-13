'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Skill extends Model {

		static associate(models) {
		}
	};
	
	Skill.init({
		skill: {
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
		modelName: 'Skill',
	  });
	return Skill;
};
