'use strict';
const {
	Model
} = require('sequelize');
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
	class ProposalSkill extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			ProposalSkill.belongsTo(models.Skill, {
				foreignKey: "skillId",
				as: 'skill'
			})
		}
	};
	ProposalSkill.init({
	
		skillId: DataTypes.INTEGER,
		proposalId: DataTypes.INTEGER,
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
		modelName: 'ProposalSkill',
		timestamps: true
	});
	return ProposalSkill;
};
