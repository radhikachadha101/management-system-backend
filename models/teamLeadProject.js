'use strict'
const {
  Model
} = require ('sequelize')
module.exports = (sequelize, DataTypes) => {
  class TeamLeadProject extends Model {
  /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TeamLeadProject.belongsTo(models.User, {
				foreignKey: "userId",
        as: 'userInfo',

      })
    }
  };
  TeamLeadProject.init({
    createdBy: {
		type: DataTypes.INTEGER,
		allowNull: true,
  },
  projectId:{
    type: DataTypes.INTEGER,
		allowNull: true,
  },
  userId:{
    type: DataTypes.INTEGER,
		allowNull: true,
  },
	updatedBy: {
		type: DataTypes.INTEGER,
		allowNull: true,
	}
},{
	sequelize,
    modelName: 'TeamLeadProject',
	timestamps: true
  });
  return TeamLeadProject;
}
