import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { socket } from "../App";
function MessageModal() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("use effive runnign");
    socket.on("chat", (data) => {
      setMessages((prevChat) => [...prevChat, data.chat]);
      console.log(messages);
    });

    return () => {
      socket.on("chat", () => setMessages([...prevChat]));
    };
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleSend = () => {
    // setMessages([...messages, message]);
 
    setMessage("");
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Open Message Modal
      </Button>

      <Modal id="messageModal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Messages</Modal.Title>
        </Modal.Header>
        <Modal.Body id="modal-body">
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
    </>
  );
}

export default MessageModal;
