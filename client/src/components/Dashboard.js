import { act, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import { API_BASE_URL } from "../constants/apiConstants";
import { Navigate } from "react-router-dom";

const token = "your_jwt_token"; // Fetch from localStorage or context

const Dashboard = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState(null);
    const [inputMessage, setInputMessage] = useState("");
    const socketRef = useRef(null);
    const [ws, setWs] = useState(null)
    const auth = useAuth();
    const [user, setUser] = useState(null)
    const [activeUsers, setActiveUsers] = useState([]);

    const fetchActiveUsers = async () => {
        await axios.get(`${API_BASE_URL}/api/users/activeUsers`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        }).then(response => setActiveUsers(response.data.activeUsers))
        .catch(err => console.error("Error Fetching Users: ", err))
    }

    // Fetch all messages from backend API
    const fetchMessages = async () => {
        await axios.get(`${API_BASE_URL}/api/messages/`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        })
            .then((response) => {
            setMessages(response.data);
            })
            .catch((error) => console.error("Error fetching messages:", error));
    }

    useEffect(() => {

        const currentUser = localStorage.getItem('user');
        if (currentUser) {
            setUser(JSON.parse(currentUser));
        }

        if (socketRef.current) return;

        // Connect to WebSocket server
        const socket = new WebSocket(`ws://localhost:8080?token=${auth.token}`);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("Connected to WebSocket server");
        };

        socket.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);

            if(newMessage.type == 'message') {
                setNewMessage(newMessage.data);
                fetchMessages();
            } else if (newMessage.type == 'user-disconnected') {
                fetchActiveUsers();
            } else if (newMessage.type == 'user-connected') {
                fetchActiveUsers();
            }
            
        };

        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        socket.onclose = async(event) => {
            console.log("Disconnected from WebSocket");
            console.warn(`WebSocket closed: ${event.code} - ${event.reason}`);
        };

        setWs(socket);

        fetchMessages();

        return () => {
            if (socket.readyState === 1) { // <-- This is important
                socket.close();
            }
        }
    }, [messages, activeUsers]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const message = {
                sender: user,
                content: inputMessage
            }
            socketRef.current.send(JSON.stringify(message))
        } else {
            console.warn("WebSocket is not connected.");
        }
    };

    const handleLogout = async() => {
        await auth.logout(auth.token);
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null
        }
    }

    return (
        <div>
            <nav className='navbar navbar-dark bg-dark'>
                <div className='container-fluid'>
                    <span className="navbar-brand h3 title" onClick={() => Navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                        Dashboard
                    </span>
                    <div className='d-flex'>
                        <button className='btn btn-danger' onClick={() => handleLogout()}>Logout</button>
                    </div>
                </div>
            </nav>
            <div className="" style={{ borderColor: 'lightblue' }}>
                <form onSubmit={sendMessage}>
                    <div className="form-group mt-3">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type a message..." 
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">Send</button>
                </form>
            </div>

            <div>
                <h2>Notification</h2>
                {newMessage && (
                    <ul>
                        <strong>{newMessage.sender?.name || "Unknown"}</strong> sent "{newMessage.content}"
                    </ul>
                )}
            </div>

            <div>
                <h2>Chat History</h2>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>
                            <strong>{msg.user?.name || "Unknown"}:</strong> "{msg.content}"
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Active Users</h2>
                <ul>
                    {activeUsers && activeUsers.map((activeUser, index) => (
                        <li key={index}>
                            <strong>{activeUser.name}</strong>
                        </li>
                    ))}
                </ul>
            </div>
            
        </div>
    );
};

export default Dashboard;
