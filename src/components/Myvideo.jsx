import React, { useContext, ref, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { CameraVideo,CameraVideoFill } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { SocketContext } from "./ConnectionStore";

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
    useContext(SocketContext);
  // console.log(
  //   `name:----${name},callAccepted:--- ${callAccepted},myvideo:--- ${myVideo},uservideo:--- ${userVideo},callEnded:--- ${callEnded},stream:--- ${stream},call:--- ${call}`,
  //   "i am context"
  // );
  // const useStyles = makeStyles((theme) => ({
  //   video: {
  //     width: '550px',
  //     [theme.breakpoints.down('xs')]: {
  //       width: '300px',
  //     },
  //   },
  //   paper: {
  //     padding: '10px',
  //     border: '2px solid black',
  //     margin: '10px',
  //   },
  // }));

  // const classes = useStyles();

  return (
    <Container>
      <Row className="justify-content-center">
        {stream && (
          <Col xs={12} md={6} className="mb-3">
            <div>
              <Row className="align-items-center">
                <Col xs={2}>
                  <CameraVideo size={48} />
                </Col>
                <Col xs={10}>
                  {/* <label variant="h5" gutterBottom>{name || 'Name'}</label> */}
                  <h3>{name || "Name"}</h3>
                  {/* <input
                    type="text"
                    ref={myVideo}
                    placeholder="deepak k"
                    value=''
                    onChange={() => console.log("kkk")}
                  /> */}
                  //{" "}
                  <video
                    ref={myVideo}
                    playsInline
                    muted
                    autoPlay
                    style={{ height: "50px", marginLeft: "200px" }}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        )}
        {callAccepted && !callEnded && (
          <Col xs={12} md={6} className="mb-3">
            <div>
              <Row className="align-items-center">
                <Col xs={2}>
                  <CameraVideoFill size={48} />
                </Col>
                <Col xs={10}>
                  <h3>{call.name || "Name"}</h3>
                  <video
                    playsInline
                    ref={userVideo}
                    autoPlay
                    style={{ height: "50px", marginLeft: "200px" }}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default VideoPlayer;
