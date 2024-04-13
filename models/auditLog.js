'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class AuditLog extends Model {

		static associate(models) {
		}
	};

	AuditLog.init({
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		entityName: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		entityId: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		action: {
			type: DataTypes.STRING(32),
			allowNull: false,
		},
		createdBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		createdByEmail: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		values: { type: DataTypes.TEXT, allowNull: false },
		
	}, {
		sequelize,
		timestamps: true,
		modelName: 'auditLog',
	});
	return AuditLog;
};
