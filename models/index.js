'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { mysqlUri } = require('../env');
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(mysqlUri, {
    dialect: "mysql",
    timezone:"+05:30",
    define: {
      timestamps: false
    },
    dialectOptions: {
      dateStrings: true,
      typeCast: {
        useUTC: false, 
        dateStrings: true,
        typeCast: true
      }
    }
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
