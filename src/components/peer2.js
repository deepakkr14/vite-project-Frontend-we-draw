import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

const ClientB = () => {
  const [peerB, setPeerB] = useState(null);
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const peer = new Peer(); // Create Peer instance for Client B
    setPeerB(peer);
    
    peer.on('open', (id) => {
      console.log('Client B ID:', id);
    });
    
    peer.on('connection', (conn) => {
      console.log('Connected to Client A:', conn.peer);
      setConnection(conn);
      
      conn.on('data', (data) => {
        console.log('Received data from Client A:', data);
      });
    });
    
    return () => {
      if (peer) {
        peer.destroy(); // Clean up Peer instance
      }
    };
  }, []);

  const handleSend = () => {
    if (connection) {
      connection.send(message); // Send message to Client A
    }
  };

  return (
    <div>
      <h2>Client B</h2>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSend}>Send Message to Client A</button>
    </div>
  );
};

export default ClientB;
