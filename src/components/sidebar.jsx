// import React, { useState, useContext } from 'react';
// import { Button, Form, Container } from 'react-bootstrap';
// import { CopyToClipboard } from 'react-copy-to-clipboard';
// import { Assignment, Phone, PhoneDisabled } from 'react-feather';
// import { SocketContext } from '../Context';

// const useStyles = () => ({
//   paper: {
//     padding: '10px 20px',
//     border: '2px solid black',
//   },
// });

// const Sidebar = ({ children }) => {
//   const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
//   const [idToCall, setIdToCall] = useState('');
//   const classes = useStyles();

//   return (
//     <Container fluid>
//       <Form.Group className={classes.paper}>
//         <Form.Label>Account Info</Form.Label>
//         <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
//         <CopyToClipboard text={me} className="mt-2">
//           <Button variant="primary" block>
//             Copy Your ID
//             <Assignment className="ml-2" size={15} />
//           </Button>
//         </CopyToClipboard>

//         <Form.Label className="mt-3">Make a call</Form.Label>
//         <Form.Control type="text" placeholder="ID to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} />
//         {callAccepted && !callEnded ? (
//           <Button variant="danger" block onClick={leaveCall} className="mt-2">
//             Hang Up
//             <PhoneDisabled className="ml-2" size={15} />
//           </Button>
//         ) : (
//           <Button variant="success" block onClick={() => callUser(idToCall)} className="mt-2">
//             Call
//             <Phone className="ml-2" size={15} />
//           </Button>
//         )}
//       </Form.Group>
//       {children}
//     </Container>
//   );
// };

// export default Sidebar;

import React, { useState, useContext } from "react";
import {
  Button,
  Form,
  Navbar,
  ToggleButton,
  Nav,
  Container,
  NavDropdown,
  FormLabel,
} from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Paperclip, Phone, PhoneVibrate } from "react-bootstrap-icons";
import { SocketContext } from "./ConnectionStore";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);

  const [idToCall, setIdToCall] = useState("");
  const [nameInput, setNameInput] = useState(name);
  console.log(me, "this me ");
  return (
    <Container>
      <Navbar bg="light" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand>Account Info</Navbar.Brand>
          {/* <ToggleButton aria-controls="basic-navbar-nav" /> */}
          {/* <Navbar.Collapse id="basic-navbar-nav"> */}
          <Nav className="me-auto">
            {/* <NavDropdown title={nameInput} id="nav-dropdown"> */}
            <label>name</label>
            <input
              type="text"
              // placeholder={name || "Enter your name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {/* <button onClick={() => setNameInput("")}>Logout</button> */}
            {/* </NavDropdown> */}
          </Nav>
          <Form>
            <CopyToClipboard text={me}>
              <Button className="me-2 btn-primary">
                <Paperclip /> Copy Your ID
              </Button>
            </CopyToClipboard>
            {/* <FormLabel>Name</FormLabel> */}
            {/* <input
              type="text"
              className="m-2"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            /> */}
          </Form>
          {/* </Navbar.Collapse> */}
        </Container>
      </Navbar>
      <Navbar bg="light" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand>Make a call</Navbar.Brand>
          {/* <ToggleButton aria-controls="basic-navbar-nav" /> */}
          {/* <Navbar.Collapse id="basic-navbar-nav"> */}
          {/* <Nav className="me-auto"> */}
          <Form>
            <FormLabel>ID to call</FormLabel>
            <input
              type="text"
              className="m-2"
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
            />
            {callAccepted && !callEnded ? (
              <Button variant="secondary" className="m-2" onClick={leaveCall}>
                <PhoneVibrate /> Hang Up
              </Button>
            ) : (
              <Button
                variant="primary"
                className="m-2"
                onClick={() => callUser(idToCall)
               }
              >
                <Phone /> Call
              </Button>
            )}
          </Form>
          {/* </Nav> */}
          {/* </Navbar.Collapse> */}
        </Container>
      </Navbar>
      {children}
    </Container>
  );
};

export default Sidebar;
