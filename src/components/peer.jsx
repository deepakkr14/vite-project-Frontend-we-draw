import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button } from 'react-bootstrap';
import { Paperclip, Phone, PhoneVibrate } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";

// import './App.css';

function App() {
  const [peerId, setPeerId] = useState('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('');
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id)
    });

    peer.on('call', (call) => {

      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
       getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream)
        call.on('stream', function(remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream
          remoteVideoRef.current.play();
        });
      });
    })

    peerInstance.current = peer;
    return () => {
            if (peer) {
              peer.destroy(); // Clean up Peer instance
            }
          };
  }, [])

  function shareData() {
   
        navigator.share({
            title: 'my room id',
            text:{peerId},
            // url: 'https://example.com',
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }

  const call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {

      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream)

      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream
        remoteVideoRef.current.play();
      });
    });
  }

  return (
    <div className="App"  > 
      {/* <h1>{peerId}</h1> */}
       <CopyToClipboard text={peerId}
       onCopy={() =>alert('suceessfully copied')}>
              <button >
               <Paperclip/>Copy My ID
              </button>
            </CopyToClipboard>
            <button onClick={shareData}>Share My ID</button>
            <br/>
      <input type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
      <button className='m-2' onClick={() => call(remotePeerIdValue)}><Phone/>Call</button>
      <div>
        <video style={{width:'100%',height:'100%'}} ref={currentUserVideoRef} />
      </div>
      <div>
        <video  style={{width:'100%',height:'100%'}} ref={remoteVideoRef} />
      </div>
      <button>end</button>
    </div>
  );
}

export default App;





// import React, { useState, useEffect, useRef } from "react";
// import Peer from "peerjs";

// const ClientA = () => {
//   const [peerA, setPeerA] = useState(null);
//   const [connection, setConnection] = useState(null);
//   const [message, setMessage] = useState("");
//   const [Recmessage, setRecMessage] = useState(false);
//   const [room, setroomid] = useState("");
//   const [myId, setMyId] = useState("");
//   const [stream, setStream] = useState();
//   const [Remstream, setRemStream] = useState();
//   const myVideo = useRef();
//   const RemVideo = useRef();
//   const RoomRef = useRef();

//   useEffect(() => {
//     const peer = new Peer({ initiator: true, trickle: false }); // Create Peer instance for Client A
//     setPeerA(peer);


//     peer.on("call", (incomingCall) => {
//       console.log("i am incoming call");

//       console.log("Answer the call", stream);
//       incomingCall.answer(currentStream);
//       incomingCall.on("stream", (remoteStream) => {
//         // Handle incoming media stream
//         // setRemStream(remoteStream);
//         RemVideo.current.srcObject = remoteStream;
//         // setRecMessage(true)
//         console.log(Recmessage, "recieved wala calling again");
//         if (Recmessage == false) {
//           // again(incomingCall.peer, peer);
//         }
//       });
//     });

//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: false })
//       .then((currentStream) => {
//         setTimeout(() => {
//           setStream(currentStream);
//           myVideo.current.srcObject = currentStream;
//         }, 4000);
//       })
//       .catch((error) => {
//         console.error("Error accessing media devices:", error);
//         alert('"Error accessing media devices:"');
//       });

//     peer.on("open", (myId) => {
//       // setMyId(myId);
//       console.log("Client A ID:", myId);
//     });

   
//     return () => {
//       if (peer) {
//         peer.destroy(); // Clean up Peer instance
//       }
//     };
//   }, []);

//   function again(add, peer) {
//     setRecMessage((prev) => !prev);
//     setTimeout(() => {
//       console.log(Recmessage, "ye again wala  calling");
//       const call = peer.call(add, myVideo.current.srcObject);
//       console.log("I am calling a, ", myVideo.current.srcObject, stream);
//     }, 5000);
//   }

//   const handleConnect = (d) => {
//     if (Recmessage == false) {
//       setRecMessage((prev) => !prev);
//       console.log(Recmessage, "first connection");

//       setTimeout(() => {
//         const call = peerA.call(d, stream);
//         console.log("I am calling ", peerA, d, stream);
//         console.log(Recmessage, "first connect ke ander");
//       }, 2000);
//     }
//   };

//   return (
//     <div>
//       <h2>client</h2>
//       <h2>{myId}</h2>
//       {/* <h2>{peerA}</h2> */}
//       {/* <h2>{connection}</h2> */}
//       <video ref={myVideo} autoPlay style={{ height: "50px" }} />
//       <video ref={RemVideo} autoPlay style={{ height: "50px" }} />
//       <button
//         onClick={(e) => {
//           e.preventDefault();
//           handleConnect(room);
//         }}
//       >
//         Connect to {room}
//       </button>
//       <br />
//       {/* 
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       /> */}
//       <input
//         type="text"
//         value={room}
//         onChange={(e) => {
//           setroomid(e.target.value);
//           console.log(room);
//         }}
//       />
//       {/* <button onClick={handleSend}>Send Message to Client B</button> */}
//       {/* <button onClick={handleConnect}>connect to Client B</button> */}
//     </div>
//   );
// };

// export default ClientA;
