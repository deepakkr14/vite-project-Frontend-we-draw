import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import { Tldraw, createTLStore, defaultShapeUtils, throttle } from "tldraw";
import "tldraw/tldraw.css";
import MessageModal from "./components/Modal";
import Peer from "./components/peer";
import io from "socket.io-client";
export const socket = io.connect("http://localhost:4000"||import.meta.env.VITE_REACT_APP_URL, {
  autoConnect: false,
});
const PERSISTENCE_KEY = "example-3";

export default function PersistenceExample() {
  const messageRef = useRef();
  // const [chats, setChats] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState(
    localStorage.getItem(PERSISTENCE_KEY)
  );
const handleShow=()=>{
  setShow(true);
}
const handleClose = () => setShow(false);
  // [1]
  const [store] = useState(() =>
    createTLStore({ shapeUtils: defaultShapeUtils })
  );
  // [2]
  const [loadingState, setLoadingState] = useState({ status: "loading" });

  // function sendMessage(message) {
  //   console.log("Button clicked",message);

  //   socket.emit("chat_message", { chat: message });
  // }

  function startConnection() {
    console.log("connection initialized");
    socket.connect();
  }

  function stopConnection() {
    socket.disconnect();
    console.log("connection terminated");
  }
  function clearlocal() {
    localStorage.removeItem(PERSISTENCE_KEY);
    console.log("data cleared");
  }
  useEffect(() => {
    // socket.on("chat", (data) => {
    //   setChats((prevChat) => [...prevChat, data.chat]);
    //   console.log(chats)
    // });
    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    // Clean up event listeners
    return () => {
      // socket.off("chat",()=>setChats(prevChat => [...prevChat]));
      socket.off("connect", () => setIsConnected(true));
      socket.off("disconnect", () => setIsConnected(false));
      socket.off("foo", setFooEvents({}));
      stopConnection();
      // clearlocal();
    };
  }, [socket]);

  useLayoutEffect(() => {
    setLoadingState({ status: "loading" });

    socket.on("foo", (value) => {
      localStorage.setItem(PERSISTENCE_KEY, value.message);

      setFooEvents(() => JSON.parse(value.message));
      store.loadSnapshot(JSON.parse(value.message));
    });
    // Get persisted data from local storage
    var persistedSnapshot = fooEvents;

    if (persistedSnapshot) {
      try {
        // const snapshot = JSON.parse(fooEvents);
        const snapshot = JSON.parse(persistedSnapshot);
        store.loadSnapshot(snapshot);
        setLoadingState({ status: "ready" });
      } catch (error) {
        setLoadingState({ status: "error", error: error.message }); // Something went wrong
      }
    } else {
      setLoadingState({ status: "ready" }); // Nothing persisted, continue with the empty store
    }

    // Each time the store changes, run the (debounced) persist function
    const cleanupFn = store.listen(
      throttle(() => {
        const snapshot = store.getSnapshot();
        setFooEvents(() => store.getSnapshot());
        socket.emit("send_message", { message: JSON.stringify(snapshot) });
        // localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(snapshot));
      }, 1)
    );

    return () => {
      cleanupFn();
    };
  }, [store]);

  // [3]
  if (loadingState.status === "loading") {
    return (
      <div className="tldraw__editor">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (loadingState.status === "error") {
    return (
      <div className="tldraw__editor">
        <h2>Error!</h2>
        <p>{loadingState.error}</p>
      </div>
    );
  }

  return (
    <div className="tldraw__editor">
      <div
        style={{ position: "absolute", inset: 1, height: "75%", width: "75%" }}
      >
        <Tldraw store={store} />
        <p>Connection State: {isConnected ? "Connected" : "Disconnected"}</p>
        <input placeholder="Message" ref={messageRef} />
        <button onClick={sendMessage}>Send message</button>
        <button onClick={startConnection} disabled={isConnected}>
          connect Canvas
        </button>
        <button onClick={stopConnection} disabled={!isConnected}>
          disconnect Canvas
        </button>
        <button onClick={clearlocal}>clear local history</button>
        <MessageModal />
      
        {/* <Button variant="primary" status={showModal}  >
        Open Message Modal
      </Button> */}
        
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          height: "75%",
          width: "25%",
          marginLeft: "76%",
        }}
      >
        <Peer />
      </div>

      {/* <VideoPlayer /> */}
      {/* <Sidebar> */}
      {/* <Notifications /> */}
      {/* </Sidebar> */}
    </div>
  );
}
