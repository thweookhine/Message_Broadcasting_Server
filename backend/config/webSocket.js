const {WebSocketServer} = require("ws");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message  = require("../models/Message");

const SECRET_KEY = "your_secret_key";

// Helper: broadcast to all connected clients
function broadcast(wss, data) {
    // Broadcast message to all clients
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

function setupWebSocket(server) {
    const wss = new WebSocketServer({ server});

    async function authenticateUser(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return await User.findByPk(decoded.id);
        } catch (err) {
            return null;
        }
    }

    wss.on("connection", async (ws, req) => {
        const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get("token");
        const user = await authenticateUser(token);

        if (!user) {
            console.log("Web Socket Connection closed due to User Not Found")
            ws.close();
            return;
        }

        console.log(`User ${user.name} connected`);
        broadcast(wss, { 
            type: 'user-connected',
            data: {
                name: user.name
            }
        })

        ws.on("message", async (messageData) => {
            const data = JSON.parse(messageData);

            const newMessage = new Message({
                senderId: data.sender.id,
                content: data.content
            });

            await newMessage.save();

            broadcast(wss, { 
                type: 'message',
                data: {
                    sender: data.sender, 
                    content: data.content 
                }
            })
        });

        ws.on("close", () => {
            console.log(`User ${user.name} disconnected`);
            broadcast(wss, { 
                type: 'user-disconnected',
                data: {
                    name: user.name
                }
            })
        });
    });

    console.log("WebSocket server is ready!");
}

module.exports = { setupWebSocket };
