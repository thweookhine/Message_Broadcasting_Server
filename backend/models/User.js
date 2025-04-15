const validator = require('validator');
const sequelize = require('../config/db');
const { DataTypes, Sequelize } = require('sequelize');
const Message = require('./Message');

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Username is required'
            },
            notEmpty: {
                msg: 'Username cannot be empty'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Email cannot be empty'
            },
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING
    },
    isActive: {
        type: DataTypes.BOOLEAN
    },
    timestamp: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
    },
},{
    tableName: 'users',  // Set the table name explicitly
})

// Define associations after the model is defined
User.associate = function(models) {
    // User can have many messages (sent or received)
    User.hasMany(Message, { foreignKey: "senderId"});
};

User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
};

module.exports = User