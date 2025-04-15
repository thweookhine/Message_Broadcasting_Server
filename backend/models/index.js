
const fs = require('fs');
const path = require('path');
const sequelize = require('../config/db')
const Sequelize = require('sequelize');

const db = {}

fs.readdirSync(__dirname)
  .filter(file => file != 'index.js' && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file));  
    db[model.name] = model
  })

// Setup associations
Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;