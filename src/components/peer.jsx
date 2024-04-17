import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

const ClientA = () => {
  const [peerA, setPeerA] = useState(null);
  const [peerB, setPeerB] = useState(null);
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState("");
  const [Recmessage, setRecMessage] = useState(0);
  const [room, setroomid] = useState("");
  const [myId, setMyId] = useState("");
  const [stream, setStream] = useState();
  const [Remstream, setRemStream] = useState();
  const myVideo = useRef();
  const RemVideo = useRef();
  const RoomRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((currentStream) => {
        setStream(currentStream);
        setTimeout(() => {
          myVideo.current.srcObject = currentStream;
        }, 1);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
    function again(add) {
      if (Recmessage<2){
      setTimeout(() => {
        const call = peer.call(add, myVideo.current.srcObject);
        setRecMessage((prev)=>prev + 1)
        console.log(
          
          "I am calling a, ",
          myVideo.current.srcObject,
          stream
        );
      }, 5000);
    }
  }
    // socket.on("me", (id) => setMyId(id));

    // socket.on("callUser", ({ userToCall, from, name }) => {

    // setCall({ isReceivingCall: true, from, name: callerName, signal });
    // });

    const peer = new Peer({ initiator: true, trickle: false }); // Create Peer instance for Client A
    setPeerA(peer);

    peer.on("open", (myId) => {
      setMyId(myId);
      console.log("Client A ID:", myId);
    });

    peer.on("call", (incomingCall) => {
      console.log("i am incoming call", );
      incomingCall.answer(); // Answer the call
      incomingCall.on("stream", (remoteStream) => {
        // Handle incoming media stream
        console.log("i am recieved call");
        setRemStream(remoteStream);
        RemVideo.current.srcObject = remoteStream;
        console.log(Recmessage,'messssssssssssss')
        if(Recmessage<2) again(incomingCall.peer);
       
      });
    });

    peer.on("connection", (conn) => {
      console.log("Connected to Client B:", conn.peer);
      setConnection(conn);
      // setRecMessage(conn.peer);

      conn.on("data", (data) => {
        console.log("Received data from Client B:", data);
        // setRecMessage(data);
      });
    });
    console.log(peerA, "evetn peer", peer);
    return () => {
      if (peer) {
        peer.destroy(); // Clean up Peer instance
      }
    };
  }, []);

  const handleConnect = (d) => {

    console.log( "room");
    // // socket.emit("callUser", { userToCall: room, from: myId, name: "user1" });
    console.log( "peer");
    // peer.on("open", (myId) => {
    //   setMyId(myId);
    //   console.log("Client A ID:", myId);
    // });
    if (Recmessage<2){

    setTimeout(() => {
      const call = peerA.call(d, stream);
      console.log("I am calling ");
      setRecMessage((prev)=>prev + 1)

    }, 2000);}
  };
  const handleSend = () => {
    console.log("i am sending-----1");

    if (connection) {
      console.log("i am sending------2", myId);
      connection.send(message); // Send message to Client A
      // connection.send(message); // Send message to Client A
    }
  };

  const handleReverse = (id) => {
    console.log(peerA, "peerA", peer);

    peerA.on("open", (myId) => {
      console.log("Client A ID:", myId);
      console.log(id, "id", myId);
      let conn2 = peerA.connect(id);

      setTimeout(() => {
        const call = peerA.call(id, stream);
        console.log("I am calling reverse");
      }, 5000);
    });
  };

  
  return (
    <div>
      <h2>client</h2>
      <h2>{myId}</h2>
      {/* <h2>{peerA}</h2> */}
      {/* <h2>{connection}</h2> */}
      <video ref={myVideo} autoPlay style={{ height: "50px" }} />
      <video ref={RemVideo} autoPlay style={{ height: "50px" }} />
      <button
        onClick={(e) => {
          e.preventDefault();
          handleConnect(room);
        }}
      >
        Connect to client B {room}
      </button>
      <br />

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input
        type="text"
        value={room}
        onChange={(e) => {
          setroomid(e.target.value);
          console.log(room);
        }}
      />
      <button onClick={handleSend}>Send Message to Client B</button>
      {/* <button onClick={handleConnect}>connect to Client B</button> */}
    </div>
  );
};

export default ClientA;
