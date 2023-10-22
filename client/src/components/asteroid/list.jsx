/**
 * List of asteroids
 */

import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";

const AsteroidList = () => {
  const [list, setList] = useState([]);
  const { lastJsonMessage, readyState } = useWebSocket("ws://localhost:3100");

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("http://localhost:3000/asteroids");
        if (res.ok) {
          const listData = await res.json();
          setList(listData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (!lastJsonMessage || lastJsonMessage.message !== "asteroidUpdate") {
      return;
    }
    const asteroid = lastJsonMessage.asteroid;
    if (!asteroid) {
      return;
    }
    const newList = list.map((item) => {
      if (item.id === asteroid.id) {
        item = asteroid;
      }
      return item;
    });
    setList([...newList]);
  }, [readyState, lastJsonMessage]);

  return (
    <div className="list">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Minerals</th>
            <th>Current miner</th>
            <th>Position (x, y)</th>
          </tr>
        </thead>

        <tbody>
          {list.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {item.mineralAmount}/{item.totalMineralAmount}
              </td>
              <td>{item.minerId || "-"}</td>
              <td>
                {item.x}, {item.y}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AsteroidList;

// class AsteroidList extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       list: [],
//     };
//   }

//   componentDidMount() {
//     this.getData();
//   }

//   async getData() {
//     try {
//       const res = await fetch("http://localhost:3000/asteroids");
//       if (res.ok) {
//         const list = await res.json();
//         this.setState({ list });
//       }
//     } catch {}
//   }

//   render() {
//     return (
//       <div className="list">
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Minerals</th>
//               <th>Current miner</th>
//               <th>Position (x, y)</th>
//             </tr>
//           </thead>

//           <tbody>
//             {this.state.list.map((item) => (
//               <tr key={item.id}>
//                 <td>{item.id}</td>
//                 <td>{item.mineralAmount}/{item.totalMineralAmount}</td>
//                 <td>{item.minerId || '-'}</td>
//                 <td>{item.x}, {item.y}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   }
// }

// export default AsteroidList;
