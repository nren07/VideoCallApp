const express = require('express');
const { Server } = require('socket.io');
const emailToSocketIdMap=new Map();
const socketToEmailIdMap=new Map();

// Initialize Express
const app = express();

// Initialize Socket.IO server with CORS configuration
const io = new Server(8001, {
    cors: {
        origin: "*", // Allow all origins (for development, adjust as needed for production)
        methods: ["GET", "POST"]
    }
});


// Handle incoming connections
io.on('connection', (socket) => {
    console.log("Socket connected: " + socket.id);
    
    // Optionally, you can handle socket events here
    socket.on('disconnect', () => {
        console.log("Socket disconnected: " + socket.id);
    });

    socket.on("room:joined",(data)=>{
        const {email,room}=data;
        emailToSocketIdMap.set(email,socket.id);
        socketToEmailIdMap.set(socket.id,email);
        io.to(room).emit("user:joined-room",{email,id:socket.id}); // here we are emit a msg event to room that a user is joined with socket id and email
        socket.join(room); //socket join room or now socket is linked with this room id
        //         "socket.emit"
        // Purpose: Used to send an event to a specific client
        //         "socket.to"
        // Purpose: Used to broadcast messages to specific rooms or namespaces.
        io.to(socket.id).emit("room:joined",data); 
    })
    socket.on("user:call",(data)=>{
        const {to,offer}=data;
        console.log('user call backend');
        io.to(to).emit("incomming:call",{from:socket.id,offer});
    })
    socket.on('call:accept',({to,ans})=>{
        console.log("call accept server",{to},{ans});
        io.to(to).emit('call:accept',{from:socket.id,ans});
    })
    socket.on('peer:nego:needed',(data)=>{
        const {to,offer}=data;
        console.log("peer:nego:needed server");
        io.to(to).emit('peer:nego:needed',{from:socket.id,offer});
    })
    socket.on('peer:nego:done',(data)=>{
        const {to,ans}=data;
        console.log("peer:nego:done server");
        io.to(to).emit('peer:nego:final',{form:socket.id,ans});
    })
});

// Start the Express server
app.listen(8000, () => {
    console.log("Server is listening on port 8000");
});
