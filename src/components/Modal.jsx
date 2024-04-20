import React, { useState, useEffect, useRef } from 'react'
import { Modal, Form, Button } from "react-bootstrap";

const Modals = ({ status }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const modalBodyRef = useRef(null);

  useEffect(() => {
    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTop = modalBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    setMessages([...messages, message]);
    setMessage("");
  };

  return (
    <div>
      <Modal id="messageModal" show={status} ref={modalBodyRef}>
        <Modal.Header closeButton>
          <Modal.Title>Messages</Modal.Title>
        </Modal.Header>
        <Modal.Body ref={modalBodyRef}>
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Form.Control
            as="textarea"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="primary" onClick={handleSend}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Modals;



// import React, { useContext } from 'react';
// import { Button } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { SocketContext } from './ConnectionStore';

// const Notifications = () => {
//   const { answerCall, call, callAccepted } = useContext(SocketContext);
//   return (
//     <>

//     </>
//   );
// };

// export default Notifications;
