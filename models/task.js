'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Task extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {

			Task.belongsTo(models.Project, {
				foreignKey: "projectId",
				as: 'Projects',

			})

			Task.belongsTo(models.User, {
				foreignKey: "createdBy",
				as: 'userInfo',

			})


			Task.hasMany(models.Comment, {
				foreignKey: 'timeEntryId',
				as: 'comments'
			});


			// define association here
			//   Task.hasOne(models.TaskStatus, {
			//     foreignKey: "id",
			//   })
			//   Task.hasOne(models.ApprovedStatus, {
			//     foreignKey: "id",
			//   })
		}
	};
	Task.init({
		projectId: DataTypes.INTEGER,
		description: DataTypes.TEXT,
		startedAt: DataTypes.DATE,
		completedAt: DataTypes.DATE,
		clockedTime: DataTypes.INTEGER,
		isBillable: DataTypes.BOOLEAN,
		statusId: DataTypes.INTEGER,
		approvedStatusId: DataTypes.INTEGER,
		title: DataTypes.STRING,
		videoLink: DataTypes.TEXT,
		isManual: DataTypes.BOOLEAN,
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
		modelName: 'Task',
		timestamps: true
	});
	return Task;
};
