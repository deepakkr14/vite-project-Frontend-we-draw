import { useLayoutEffect, useState, useEffect } from "react";
import { Tldraw, createTLStore, defaultShapeUtils, throttle } from "tldraw";
import "tldraw/tldraw.css";
import VideoPlayer from "./components/Myvideo";
import Sidebar from "./components/sidebar";
import Notifications from "./components/Events";
import io from "socket.io-client";
const socket = io.connect("http://localhost:4000", {
  autoConnect: false,
});
const PERSISTENCE_KEY = "example-3";

export default function PersistenceExample() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState(localStorage.getItem(PERSISTENCE_KEY));

  // [1]
  const [store] = useState(() =>
    createTLStore({ shapeUtils: defaultShapeUtils })
  );
  // [2]
  const [loadingState, setLoadingState] = useState({ status: "loading" });

  function sendMessage() {
    console.log("Button clicked");
    // socket.emit("send_message", { message: "Hello from client" });
  }

  function startConnection() {
    console.log("connection initialized");
    socket.connect();
  }

  function stopConnection() {
    socket.disconnect();
    console.log("connection terminated");
  }
  function clearlocal() {
   localStorage.removeItem(PERSISTENCE_KEY)
    console.log("data cleared");
  }
  useEffect(() => {
    socket.on("receive_message", (data) => {
      alert(data.message);
    });
    // Register event listeners
    socket.on("connect",()=>setIsConnected(true));
    socket.on("disconnect",()=>setIsConnected(false));

    // Clean up event listeners
    return () => {
      socket.off("connect",()=>setIsConnected(true));
      socket.off("disconnect" ,()=>setIsConnected(false));
      socket.off("foo", setFooEvents({}));
      stopConnection()
      clearlocal()
    };
  }, [socket]);

  useLayoutEffect(() => {
    setLoadingState({ status: "loading" });
    // var persistedSnapshot = localStorage.getItem(PERSISTENCE_KEY);
    // console.log(fooEvents,'raw')
    console.log(JSON.parse(fooEvents))
    socket.on("foo", (value)=>{ localStorage.setItem(PERSISTENCE_KEY, value.message);
  
      setFooEvents(()=>JSON.parse(value.message))
      store.loadSnapshot(JSON.parse(value.message));
      // store.loadSnapshot(JSON.parse(fooEvents));
    });
    // Get persisted data from local storage
    var persistedSnapshot = fooEvents
console.log(JSON.parse(fooEvents), 'persisted')
 
    if (persistedSnapshot) {
      try {
        // const snapshot = JSON.parse(fooEvents);
        const snapshot = JSON.parse(persistedSnapshot);
        console.log('i am running')
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
        setFooEvents(()=>store.getSnapshot())
        console.log(store.getSnapshot(), "my stoeree");

        console.log(JSON.parse(fooEvents),'-------------')
console.log('sent',snapshot)
        socket.emit("send_message", { message:JSON.stringify(snapshot) });
        // localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(snapshot));
      }, 5000)
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
      <div style={{ position: "absolute", inset: 1, height: "100px" }}>
        {/* <Tldraw store={store} /> */}
        {/* </div> */}
        {/* <div  style={{ position: "absolute", inset: '35px', height: "500px" }}> */}
        <p>Connection State: {isConnected ? "Connected" : "Disconnected"}</p>
        <input placeholder="Message" />
        <button onClick={sendMessage}>Send message</button>
        <button onClick={startConnection} disabled={isConnected}>
          connect
        </button>
        <button onClick={stopConnection} disabled={!isConnected}>
          disconnect
        </button>
        <button onClick={clearlocal} >
         clear
        </button>
        <VideoPlayer />
      <Sidebar>
        <Notifications />
      </Sidebar>
      </div>
    </div>
  );
}
