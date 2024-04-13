'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class HiredProposalProfile extends Model {

		static associate(models) {

			HiredProposalProfile.belongsTo(models.ClientDetail, {
				foreignKey: "clientId",
				as: 'client'
			})
			HiredProposalProfile.belongsTo(models.BidProfile, {
				foreignKey: "profileId",
				as: 'profile'
			})
		}
	};
	
	HiredProposalProfile.init({
		clientId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
        proposalId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
        profileId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
        contractLimit:{
            type: DataTypes.TEXT,
			allowNull: true,
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
		modelName: 'HiredProposalProfile',
	  });
	return HiredProposalProfile;
};
