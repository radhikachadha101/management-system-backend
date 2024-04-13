'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       Comment.belongsTo(models.User, {
				foreignKey: "createdBy",
        as: 'userInfo',
      })

      Comment.hasMany(models.viewedComments, {
        foreignKey: 'commentId',
        as: 'commentData'
      });
    }
  };
  Comment.init({
    timeEntryId: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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
    modelName: 'Comment',
	timestamps: true
  });
  return Comment;
};
