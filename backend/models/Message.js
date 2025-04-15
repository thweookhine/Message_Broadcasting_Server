const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Message = sequelize.define("messages", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
},{
    tableName: 'messages',  // Set the table name explicitly

})
// Define associations after the model is defined
Message.associate = function(models) {
    // Message belongs to User (sender)
    Message.belongsTo(models.users, { foreignKey: "senderId"});
};

module.exports= Message