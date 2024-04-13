'use strict'
const {
  Model
} = require ('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
  /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
	  // Project.belongsToMany(models.User, { through: 'UserProject' });

    Project.hasMany(models.TeamLeadProject, {
      foreignKey: 'projectId',
      as: 'TeamLeadProject'
    });

    Project.hasMany(models.UserProject, {
      foreignKey: 'projectId',
      as: 'UserProject'
    });


    }
  };
  Project.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    client: DataTypes.INTEGER,
    users: DataTypes.INTEGER,
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
    modelName: 'Project',
	timestamps: true
  });
  return Project;
}
