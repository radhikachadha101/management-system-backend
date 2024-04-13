'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class ProposalDocument extends Model {

		static associate(models) {
		
		}
	};
	
	ProposalDocument.init({
		originalName: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		documentUrl:{
			type: DataTypes.TEXT,
			allowNull: true,
		},
		filePath:{
			type: DataTypes.TEXT,
			allowNull: true,
		},
		mimeType:{
			type: DataTypes.TEXT,
			allowNull: true,
		},
		filename:{
			type: DataTypes.TEXT,
			allowNull: true,
		},
		proposalId: DataTypes.INTEGER,
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
		modelName: 'ProposalDocument',
	  });
	return ProposalDocument;
};
