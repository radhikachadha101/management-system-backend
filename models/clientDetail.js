'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class ClientDetail extends Model {

		static associate(models) {
			
			ClientDetail.belongsTo(models.Countries, {
				foreignKey: "countryId",
				as: 'country'
			}),
			ClientDetail.belongsTo(models.User, {
				foreignKey: "createdBy",
				as: 'createdUser',

			}),
			ClientDetail.belongsTo(models.User, {
				foreignKey: "updatedBy",
				as: 'updatedUser',

			})
		}
	};
	
	ClientDetail.init({
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
        countryId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
        timezone: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
        email:{
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
		},
        phone:{
			type: DataTypes.STRING,
			allowNull: true,
		},
        othersContact:{
			type: DataTypes.TEXT,
			allowNull: true,
		},
        clientSharedCredentials:{
			type: DataTypes.TEXT,
			allowNull: true,
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
		modelName: 'ClientDetail',
	  });
	return ClientDetail;
};
