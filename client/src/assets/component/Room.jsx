import React,{useCallback, useEffect, useState,useRef} from "react";
import { useSocket } from "./SocketProvider";
import ReactPlayer from 'react-player';
import peer from './../service/peer'

const Room=()=>{

    const [remoteUserId,setRemoteUserId]=useState(null);
    const [myStream,setMyStream]=useState();
    const [remoteStream,setRemoteStream]=useState();
    const socket=useSocket();

    const handleClick=useCallback(async()=>{
        console.log("handle click",{myStream});
        const offer=await peer.getOffer();
        console.log("handle call button",{offer});
        socket.emit("user:call",{to:remoteUserId,offer});
    },[remoteUserId,socket])
    const sendStream=useCallback(async()=>{
        let stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true}); 
        setMyStream(stream);
        for (const track of stream.getTracks()) {
            peer.peer.addTrack(track, stream);
        }
    },[]);
    
    const handleUserJoin=useCallback((data)=>{
        const {email,id}=data;
        console.log(email," Joined the Room and socket Id is ",id);
        setRemoteUserId(id); 
    },[socket]);

    const videoStream=useCallback(async()=>{
        let stream=await navigator.mediaDevices.getUserMedia({audio:true,video:true}); 
        console.log({stream});
        setMyStream(stream);
        
    },[]);

    const handleCallAccept=useCallback(async({from,ans})=>{
        await peer.setRemoteDescription(ans);
    },[]);
    const handleIncommingCall=useCallback(async(data)=>{
        // console.log("handle incomming call",{myStream});
        const {from,offer}=data;
        const ans=await peer.getAnswer(offer);
        console.log("incomming call ",{from},{offer});
        socket.emit('call:accept',{to:from,ans});
    },[]);

    const trackListener=useCallback((ev)=>{
        const remoteStream=ev.streams;
        console.log("peer.peer event listner",remoteStream);
        setRemoteStream(remoteStream[0]);
    },[remoteStream]);

    const handleNegoneeded=useCallback(async()=>{
        const offer=await peer.getOffer();
        socket.emit('peer:nego:needed',{to:remoteUserId,offer});
    },[remoteUserId,socket]);

    useEffect(()=>{
        peer.peer.addEventListener('negotiationneeded',handleNegoneeded);

        return ()=>{
            peer.peer.removeEventListener('negotiationneeded',handleNegoneeded);
        }
    },[handleNegoneeded])

    useEffect(()=>{
        peer.peer.addEventListener('track',trackListener);

        return ()=>{
            peer.peer.removeEventListener('track',trackListener);
        }
    },[trackListener])

    const handleNegoNeededIncomming=useCallback(async({from,offer})=>{
        const ans=await peer.getAnswer(offer);
        socket.emit('peer:nego:done',{to:from,ans});
    },[socket]);

    const handleNegoNeededFinal=useCallback(async({ans})=>{
        await peer.setRemoteDescription(ans);
    },[socket]);

    useEffect(()=>{
        handleClick();
    },[remoteUserId]);

    useEffect(()=>{
        sendStream();
    },[handleNegoNeededFinal,sendStream,socket]);

    useEffect(()=>{
        socket.on("user:joined-room",handleUserJoin);
        socket.on("incomming:call",handleIncommingCall);
        socket.on('call:accept',handleCallAccept);
        socket.on('peer:nego:needed',handleNegoNeededIncomming);
        socket.on('peer:nego:final',handleNegoNeededFinal);
        videoStream();
        return ()=>{
            socket.off("user:joined-room",handleUserJoin);
            socket.off("incomming:call",handleIncommingCall);
            socket.off('call:accept',handleCallAccept);
            socket.off('peer:nego:needed',handleNegoNeededIncomming);
            socket.off('peer:nego:final',handleNegoNeededFinal);
        }
    },[handleUserJoin,handleIncommingCall,handleCallAccept,handleNegoNeededIncomming,handleNegoNeededFinal]);

    
    return (
        <div>
            <h1>Room Page</h1>
            {myStream && <button onClick={sendStream}>Send Stream</button>}
            {myStream &&<div>
            <h2>My Video</h2>
             <ReactPlayer
                 url={myStream}
                    playing
                    muted
                    width="200px"
                    height="200px"
            />
            </div>
            }
            {remoteStream &&<div>
            <h2>Remote Video Video</h2>
             <ReactPlayer
                 url={remoteStream}
                    playing
                    muted
                    width="200px"
                    height="200px"
                   
            />
            </div>
            }
            
        </div>
        
    )
}

export default Room;