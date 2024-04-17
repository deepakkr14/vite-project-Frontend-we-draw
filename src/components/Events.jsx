import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SocketContext } from './ConnectionStore';

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  // console.log(
  //   `callAccepted:--- ${callAccepted} ,answerCall:--- ${answerCall},call:--- ${call}`,
  //   "i am context"
  // );
  return (
    <>
      {/* {call.isReceivingCall && !callAccepted && ( */}
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{call.name} is calling:</h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
        </div>
      {/* )} */}
    </>
  );
};

export default Notifications;
