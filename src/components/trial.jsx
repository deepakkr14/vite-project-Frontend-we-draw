import React, { createContext, useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
const SocketContext = createContext();

const socket = io("http://localhost:5000");
// const socket = io('https://warm-wildwood-81069.herokuapp.com');

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        // myVideo.current.srcObject = currentStream
        console.log(myVideo, "before");
        setTimeout(() => {
          myVideo.current.srcObject = currentStream;
          console.log(myVideo, "after");
        }, 1);
      });

    socket.on("me", (id) => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.on("connection", (connection) => {
      connectionRef.current = connection;
      connection.on("data", (message) => {
        setName(message);
      });
    });

    // peer.signal(call.signal);
  };

  const callUser = (id) => {
    console.log("calling", id);
    const peer = new Peer({ initiator: true, trickle: false ,stream});
    console.log(peer,"stream----");
    peer.on("signal", (data) => {
      console.log(data, "data", "data", "data", "data");
      // socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });
    socket.emit("callUser", {
      userToCall: id,
      signalData: peer.signal,
      from: me,
      name,
    });

    // setCall({ ...call, isLocalViewVisible: true, isInitiator: true });

    // console.log(data,'data','data','data','data')
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.on("connection", (connection) => {
      console.log("i am peer connection");
      connectionRef.current = connection;
      connection.on("data", (message) => {
        setName(message);
      });
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    console.log(connectionRef.current, "i am connectionRef");
    // connectionRef.current.destroy();

    // window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };