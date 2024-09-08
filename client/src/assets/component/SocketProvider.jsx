import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

// Create a Context for the WebSocket connection
const SocketContext = createContext(null);

// Custom hook to use the WebSocket connection
export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return socket;
};

// Provider component to set up and provide the WebSocket connection
export const SocketProvider = (props) => {
    // Create and memoize the socket connection
    const socket = useMemo(() => io("http://localhost:8001"), []);
    
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
};
