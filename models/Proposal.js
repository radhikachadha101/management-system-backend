'use strict';
const {
	Model
} = require('sequelize');
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
	class Proposal extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Proposal.belongsTo(models.Channel, {
				foreignKey: "channelId",
				as: 'channel'
			})

			Proposal.belongsTo(models.User, {
				foreignKey: "createdBy",
				as: 'userInfo',

			})
			Proposal.belongsTo(models.BidStatus, {
				foreignKey: "statusId",
				as: 'status'
			})
			Proposal.belongsTo(models.ProposalType, {
				foreignKey: "proposalTypeId",
				as: 'proposalType'
			})
			Proposal.hasMany(models.HiredProposalProfile, {
				foreignKey: 'proposalId',
				as: 'HiredProposalProfile'
			  });

			  Proposal.hasMany(models.ProposalSkill, {
				foreignKey: 'proposalId',
				as: 'proposalSkill'
			  });
			  Proposal.belongsTo(models.BidProfile, {
				foreignKey: "profileId",
				as: 'profile'
			})
			Proposal.hasMany(models.ProposalComments, {
				foreignKey: "proposalId",
				as: 'ProposalComments'
			})
			Proposal.belongsTo(models.ClientDetail, {
				foreignKey: "clientId",
				as: 'ClientDetail'
			})
			  
			  
			// Proposal.hasMany(models.PurposalDocument, { as: "purposalId" });
			Proposal.hasMany(models.ProposalDocument, {
				foreignKey: "proposalId",
				as: "ProposalDocuments",
			});

		}


	};
	Proposal.init({
		name: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		description: DataTypes.TEXT,
		statusId: DataTypes.INTEGER,
		rate: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		profileId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		jobUrl: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},

		bid: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		channelId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		proposalTypeId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		proposalLink: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		proposalDate: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		clientId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		active: {
			type:DataTypes.BOOLEAN,
			allowNull: true,
		},
		createdBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
		// }
		// ,
		// deletedBy: {
		// 	type: DataTypes.INTEGER,
		// 	allowNull: true,
		},
		updatedBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},

	}, {
		sequelize,
		modelName: 'Proposal',
		paranoid: true,
		timestamps: true,
	});
	return Proposal;
};
