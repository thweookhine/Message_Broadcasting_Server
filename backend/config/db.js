const {Sequelize} = require('sequelize')
require('dotenv').config(); 

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: 'localhost',
    port: 5432, 
    dialect: 'postgres'
})

sequelize.authenticate()
         .then(() => console.log('Connected to PostgreSQL DB(Docker Container)!'))
         .catch((err) => console.error('Connection error:', err));

module.exports = sequelize