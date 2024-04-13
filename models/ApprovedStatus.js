'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApprovedStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
		ApprovedStatus.hasOne(models.Task, {
			foreignKey: "approvedStatusId",
		  })
	}
  };
  ApprovedStatus.init({
	status : DataTypes.STRING,
  }, {
    sequelize,
	modelName: 'ApprovedStatus',
	timestamps: false
  });
  return ApprovedStatus;
};