/**
 * Main app layout
 */
import React, { useState, useEffect } from "react";
import Header from "./header.jsx";
import Nav from "./nav.jsx";
import Miners from "../miner/list.jsx";
import Asteroids from "../asteroid/list.jsx";
import Planets from "../planet/list.jsx";
import { BrowserRouter as Router, Route , } from "react-router-dom";
import useWebSocket from 'react-use-websocket';

// export const socket = new WebSocket("ws://localhost:3100");
// socket.onopen = () => {
//   console.log("WebSocket is connected");
// };

function App() {
  const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:3100");
  // const [isMinerDataReady, setIsMinerDataReady] = useState(false);
  // const [store, setStore] = useState([]);

  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       const res = await fetch("http://localhost:3000/miners");
  //       if (res.ok) {
  //         const list = await res.json();
  //         // setStore(list);
  //       }
  //     } catch {}
  //   };

  //   init();
  // }, [ ]);


  //   useEffect(() => {
  //     if (!isMinerDataReady) {
  //       return;
  //     }
  //     socket.onmessage = (e) => {
  //       try {
  //         const data = JSON.parse(e.data);
  //         if (data.message && data.message === "minerUpdate") {
  //           const miners = store;
  //           miners.map((item) => {
  // 			console.log(data.miner)
  //             if (item.id === data.miner.id) {

  //               item = data.miner;
  //             }
  //             return item;
  //           });
  //           setStore([...miners]);
  //         }
  //       } catch {}
  //     };
  //   }, [store, isMinerDataReady]);

  return (
      <Router>
        <main>
          <Header />
          <Nav />

          {/* <Switch> */}
            <Route path="/miners">
              <Miners />
            </Route>
            <Route path="/asteroids">
              <Asteroids />
            </Route>
            <Route path="/planets">
              <Planets />
            </Route>
          {/* </Switch> */}
        </main>
        <aside />
      </Router>
  );
}

export default App;
