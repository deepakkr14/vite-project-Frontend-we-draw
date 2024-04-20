// import React, { useState, useEffect } from 'react';
// import Peer from 'peerjs';

// const ClientB = () => {
//   const [peerB, setPeerB] = useState(null);
//   const [connection, setConnection] = useState(null);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const peer = new Peer(); // Create Peer instance for Client B
//     setPeerB(peer);
    
//     peer.on('open', (id) => {
//       console.log('Client B ID:', id);
//     });
    
//     peer.on('connection', (conn) => {
//       console.log('Connected to Client A:', conn.peer);
//       setConnection(conn);
      
//       conn.on('data', (data) => {
//         console.log('Received data from Client A:', data);
//       });
//     });
    
//     return () => {
//       if (peer) {
//         peer.destroy(); // Clean up Peer instance
//       }
//     };
//   }, []);

//   const handleSend = () => {
//     if (connection) {
//       connection.send(message); // Send message to Client A
//     }
//   };

//   return (
//     <div>
//       <h2>Client B</h2>
//       <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
//       <button onClick={handleSend}>Send Message to Client A</button>
//     </div>
//   );
// };

// export default ClientB;





import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

const ClientA = () => {
  const [peerA, setPeerA] = useState(null);
  const [peerB, setPeerB] = useState(null);
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState("");
  const [Recmessage, setRecMessage] = useState(false);
  const [room, setroomid] = useState("");
  const [myId, setMyId] = useState("");
  const [stream, setStream] = useState();
  const [Remstream, setRemStream] = useState();
  const myVideo = useRef();
  const RemVideo = useRef();
  const RoomRef = useRef();

  useEffect(() => {
    console.log(navigator.mediaSession);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log(" ia m media devise");
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((currentStream) => {
          setStream(currentStream);
          setTimeout(() => {
            myVideo.current.srcObject = currentStream;
          }, 4000);
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    }

    // if (Recmessage==false){
    //   again(add)
    
    // }
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
      console.log("i am incoming call");
      incomingCall.answer(); // Answer the call
      incomingCall.on("stream", (remoteStream) => {
        // Handle incoming media stream
        console.log("i am recieved call");
        setRemStream(remoteStream);
        RemVideo.current.srcObject = remoteStream;
        // setRecMessage(true)
        console.log(Recmessage, "recieved wala calling again");
        if (Recmessage == false) {
          again(incomingCall.peer,peer);
        }
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


function again(add,peer) {
  setRecMessage((prev)=>!prev);

      // setRecMessage(true)
      setTimeout(() => {
        console.log(Recmessage,"ye again wala  calling");
        const call = peer.call(add, myVideo.current.srcObject);
        console.log("I am calling a, ", myVideo.current.srcObject, stream);
      }, 5000);
    }

  const handleConnect = (d) => {
    console.log("room");
    // // socket.emit("callUser", { userToCall: room, from: myId, name: "user1" });
    console.log("peer");
    // peer.on("open", (myId) => {
    //   setMyId(myId);
    //   console.log("Client A ID:", myId);
    // });
    if (Recmessage == false) {
      setRecMessage((prev)=>!prev);
      console.log(Recmessage,"first connection")

      setTimeout(() => {
        const call = peerA.call(d, stream);
        console.log("I am calling ");
        console.log(Recmessage,'first connect ke ander')
      }, 2000);
    }
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
