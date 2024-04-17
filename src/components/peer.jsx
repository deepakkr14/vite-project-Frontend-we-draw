import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";

const ClientA = () => {
  const [peerA, setPeerA] = useState(null);
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState("");
  const [Recmessage, setRecMessage] = useState("");
  const [room, setroomid] = useState("");
  const [myId, setMyId] = useState("");
  const [stream, setStream] = useState();
  const [Remstream, setRemStream] = useState();
  const myVideo = useRef();
  const RemVideo = useRef();

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

    // const peer = new Peer({ initiator: true, trickle: false }); // Create Peer instance for Client A
    // setPeerA(peer);

    // peer.on("open", (myId) => {
    //   setMyId(myId);
    //   console.log("Client A ID:", myId);
    // });

    // peer.on("call", (incomingCall) => {
    //   console.log("i am incoming call");
    //   incomingCall.answer(); // Answer the call
    //   incomingCall.on("stream", (remoteStream) => {
    //     // Handle incoming media stream
    //     console.log('i am recieved call')
    //     setRemStream(remoteStream);
    //     RemVideo.current.srcObject = remoteStream;
    //   });
    //   handleReverse();
    // });

    // });

    // peer.on("connection", (conn) => {
    //   console.log("Connected to Client B:", conn.peer);
    //   setConnection(conn);
    //   setRecMessage(conn.peer)

    //   // setTimeout(()=>{peerA.call(Recmessage, stream);
    //   //   console.log("I am calling  from remote", Recmessage, stream);},4000)

    //   conn.on("data", (data) => {
    //     console.log("Received data from Client B:", data);
    //     // setRecMessage(data);
    //   });
    // });

    return () => {
      if (peer) {
        peer.destroy(); // Clean up Peer instance
      }
    };
  }, []);
  const handleSend = () => {
    console.log("i am sending-----1");
    if (connection) {
      console.log("i am sending------2", myId);
      connection.send(message); // Send message to Client A
      // connection.send(message); // Send message to Client A
    }
  };

  const handleReverse = () => {
    const peerN = new Peer({ initiator: false, trickle: false }); // Create Peer instance for Client A
    // setPeerA(peer);

    peerN.on("open", (myId) => {
      setMyId(myId);
      console.log("Client A ID:", myId);

      let conn = peerN.connect(Recmessage);
      console.log("connected with", Recmessage, "is connected");

      conn.on("open", () => {
        setConnection(conn);
        console.log("Connection to Client B opened");
        // Initiate call to Client B after a delay

        setTimeout(() => {
          const call = peerA.call(room, stream);
          console.log("I am calling ");
        });
      });
    });
    // setTimeout(()=>{peerA.call(Recmessage, stream);
    //   console.log("I am calling  from remote", Recmessage, stream);},4000)
  };

  const handleConnect = async () => {
    const peer = new Peer({ initiator: true, trickle: false }); // Create Peer instance for Client A

    peer.on("open", (myId) => {
      setMyId(myId);
      console.log("Client A ID:", myId);
    });
    // setPeerA(peer);
    let conn = await peer.connect(room);

    conn.on("open", () => {
      setConnection(conn);
      console.log("Connection to Client B opened");
      // Initiate call to Client B after a delay

      setTimeout(() => {
        const call = peer.call(room, stream);
        console.log("I am calling ");

        // Handle incoming media stream from Client B
        // call.on(
        //   "call",
        //   (remoteStream) => {
        //     console.log("Received remote stream from Client B:", remoteStream);

        //     remoteStream.answer(); // Answer the call
        //     remoteStream.on("stream", (remoteStream) => {
        //       setRemStream(remoteStream);
        //       RemVideo.current.srcObject = remoteStream;
        //     });
        //   },
        //   3000
        // );
      });
    });
    peer.on("connection", (conn) => {
      console.log("Connected to Client B:", conn.peer);
      setConnection(conn);
      setRecMessage(conn.peer);

      conn.on("data", (data) => {
        console.log("Received data from Client B:", data);
        // setRecMessage(data);
      });
    });

    peer.on("call", (incomingCall) => {
      console.log("i am incoming call");
      incomingCall.answer(); // Answer the call
      incomingCall.on("stream", (remoteStream) => {
        // Handle incoming media stream
        console.log("i am recieved call");
        setRemStream(remoteStream);
        RemVideo.current.srcObject = remoteStream;
      });
      handleReverse();
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
      <button onClick={handleConnect}>Connect to client B</button>
      <br />

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <input
        type="text"
        value={room}
        onChange={(e) => setroomid(e.target.value)}
      />
      <button onClick={handleSend}>Send Message to Client B</button>
      <button onClick={handleConnect}>connect to Client B</button>
    </div>
  );
};

export default ClientA;
