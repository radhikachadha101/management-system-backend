'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Leave extends Model {

		static associate(models) {
			Leave.belongsTo(models.User, {
				foreignKey: "createdBy",
				as: 'userCreatedId',

			}),
				Leave.belongsTo(models.User, {
					foreignKey: "updatedBy",
					as: 'userUpdatedId',

				}),
				Leave.belongsTo(models.User, {
					foreignKey: "userId",
					as: 'userName',

				})
		}
	};
	Leave.init({
		userId: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		type: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		reason: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		active: DataTypes.BOOLEAN,
		dateFrom: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		dateTo: {
			type: DataTypes.DATE,
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
	}, {
		sequelize,
		timestamps: true,
		modelName: 'Leave',
	});
	return Leave;
};

