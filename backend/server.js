const express = require('express');
const connectDB = require('./config/db');
const userRouter = require('./routes/userRouter');
const http = require("http");
const cors = require('cors');
const session = require('express-session');
const sequelize = require('./config/db');
const { setupWebSocket } = require('./config/webSocket');
const messageRouter = require('./routes/messageRoutes');
const db = require('./models');

require("dotenv").config()
const app = express();
const server = http.createServer(app);

app.use(cors());

// Sequelize config
sequelize.sync({force: false})
        .then(() => console.log('Database synced'))
        .catch(err => console.error('Error syncing database:', err));
// Initialize WebSocket server
setupWebSocket(server);
console.log('setup')

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));


app.use(express.json());
app.use("/api/users", userRouter)
app.use('/api/messages', messageRouter)

// Run server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
})