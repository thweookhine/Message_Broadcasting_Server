# Message BroadCasting Server

Message Broadcasting server that will allow clients to connect to it, disconnect to it and send messages that will be broadcasted to all connected clients.

## Features

- **Signup:**- Signup user to connect to Broadcast server
- **Login:**- Login User to connect to Broadcast server
- **Logout:**- Logout User to disconnect to Broadcast server
- **Send Message**- Send Message to all connected clients

## Prerequisites

- Node.js installed on your system.
- Prepare .env by referencing .env.sample

## Installation

**Clone the Repository**

```bash
git clone https://github.com/thweookhine/Message_Broadcasting_Server.git

# Navigate to the project Directory
cd BROADCASTSERVER

```
**Run by using docker**
```bash
docker-compose up --build
```

## Browser URLs

**Login URL**
```bash
http://localhost:3000/login
```

**Register URL**
```bash
http://localhost:3000/register
```
After authentication, it navigates to dashboard page and you can send message to all connected clients.
