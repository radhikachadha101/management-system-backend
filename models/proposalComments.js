'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class ProposalComments extends Model {

		static associate(models) {

			ProposalComments.belongsTo(models.User, {
				foreignKey: "createdBy",
				as: "user",
			});
			ProposalComments.belongsTo(models.BidStatus, {
				foreignKey: "statusId",
				as: "status",
			});
		}
	};
    
	ProposalComments.init({
		comment: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		proposalId: DataTypes.INTEGER,
        statusId:DataTypes.INTEGER,
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
		modelName: 'ProposalComments',
	  });
	return ProposalComments;
};
