import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketProvider";


const LobbyScreen = () => {

  const [email,setEmail]=useState("");
  const [room,setRoom]=useState("");
  const socket=useSocket();
  console.log(socket.id);
  const nevigate=useNavigate();

  const handleRoomJoined=useCallback((data)=>{
    const {email,room}=data;
    console.log("handleRoomJoined",{email,room});
   
    nevigate(`/room/${room}`);
  },[nevigate]);

  useEffect(()=>{
    console.log("useEffect")
    socket.on("room:joined",handleRoomJoined)

    return ()=>{
      socket.off("room:joined",handleRoomJoined);
    }
  },[socket,handleRoomJoined]);



  const handleSubmit=useCallback((e)=>{  //useCallback is used to memorised functions
    e.preventDefault();
    console.log({email},{room});
    socket.emit("room:joined",{email,room}) //socket emit event and also pass attribute to it.. it will capture in server side

  },[email,room,socket]);

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email Id:</label>
        <input type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} id="email" />
        <br/>
        <label>Room Number:</label>
        <input type="text" value={room} onChange={(e)=>setRoom(e.target.value)} />
        <br/>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default LobbyScreen;
