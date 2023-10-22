/**
 * List of planets
 */

import React, { useMemo } from "react";
import Rodal from "rodal";
import PopupContent from "./popup.jsx";
import CreateMinerForm from "./createMiner.jsx";
import Loader from "../layout/loader.jsx";
import useWebSocket from "react-use-websocket";

import { useState, useEffect } from "react";

let loaderTimeout;

const PlanetList = () => {
  const [currentMiners, setCurrentMiners]=useState([])
  const [popupVisible, setPopupVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const { lastJsonMessage, readyState } = useWebSocket("ws://localhost:3100");

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("http://localhost:3000/planets");
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
    if (!lastJsonMessage || lastJsonMessage.message !== "planetUpdate") {
      return;
    }
    const planet = lastJsonMessage.planet;
    if (!planet) {
      return;
    }
    const newList = list.map((item) => {
      if (item.id === planet.id) {
        item = planet;
      }
      return item;
    });
    setList([...newList]);
  }, [readyState, lastJsonMessage]);

  const showPopup = (miners) => {
    setCurrentMiners(miners);
    setPopupVisible(true);
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  const showForm = (e) => {
    e.stopPropagation();
    setFormVisible(true);
  };

  const hideForm = () => {
    setFormVisible(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("http://localhost:3000/planets");
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

  return (
    <div className="list">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Miners</th>
            <th>Minerals</th>
            <th>Position (x, y)</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {list.map((item) => (
            <tr
              key={item.id}
              onClick={() => {
                showPopup(item.miners);
              }}
            >
              <td>{item.name}</td>
              <td>{item.miners.length}</td>
              <td>{item.minerals}/1000</td>
              <td>
                {item.x}, {item.y}
              </td>
              <td>
                {item.minerals >= 1000 && (
                  <div className="icon-addminer" onClick={showForm}>
                    Create a miner
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Rodal
        visible={popupVisible}
        onClose={hidePopup}
        width="550"
        height="480"
      >
        <h2>List of miners of Planet 1</h2>
        {loading ? <Loader /> : <PopupContent miners={currentMiners} />}
      </Rodal>

      <Rodal visible={formVisible} onClose={hideForm} width="440" height="480">
        <h2>Create a miner</h2>
        <CreateMinerForm planets={list} />
      </Rodal>
    </div>
  );
};

export default PlanetList;
