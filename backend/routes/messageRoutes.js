const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");
const messageRouter = express.Router();
const db = require('../models');  
const { authenticateUser } = require("../middleware/authenticateUser");

messageRouter.get("/", authenticateUser,async (req, res) => {
    try {
        const messages = await Message.findAll({
            include: [{
                model: User,
                attributes: ['id', 'name']
            }],
            order: [['createdAt', 'DESC']], // optional: latest first
        }); // Fetch sender's username
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Error fetching messages" });
    }
});

module.exports = messageRouter;
