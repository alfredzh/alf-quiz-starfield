/**
 * List of miners
 */

import React from "react";
import { useState, useEffect } from "react";
import Rodal from "rodal";
import PopupContent from "./popup.jsx";
import Loader from "../layout/loader.jsx";
import useWebSocket from "react-use-websocket";
import { MinerStatusMap } from "../../types.js";

const MinerList = () => {
  const [currentId, setCurrentId] = useState(undefined)
  const [list, setList] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { lastJsonMessage, readyState } = useWebSocket("ws://localhost:3100");
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/miners/${currentId}/history`
        );
        if (res.ok) {
          const listData = await res.json();
          setHistoryList(listData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, [currentId]);

  useEffect(() => {
    if (!lastJsonMessage || lastJsonMessage.message !== "minerUpdate") {
      return;
    }
    const miner = lastJsonMessage.miner;
    if (!miner) {
      return;
    }
    const newList = list.map((item) => {
      if (item.id === miner.id) {
        item = miner;
      }
      return item;
    });
    setList([...newList]);
  }, [readyState, lastJsonMessage]);

  useEffect(() => {
    const getMiners = async () => {
      try {
        const res = await fetch("http://localhost:3000/miners");
        if (res.ok) {
          const list = await res.json();
          setList(list);
        }
      } catch {}
    };

    getMiners();
  }, []);

  const openPopup = (id) => {
    setCurrentId(id)
    setPopupVisible(true);
    setLoading(false)
  };

  const hidePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    if (popupVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [popupVisible]);

  return (
    <div className="list">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Planet</th>
            <th>Carry capacity</th>
            <th>Travel speed</th>
            <th>Mining speed</th>
            <th>Position (x, y)</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {list.map((item) => (
            <tr
              key={item.id}
              onClick={() => {
                openPopup(item.id);
              }}
            >
              <td>{item.planetName}</td>
              <td>{item.id}</td>
              <td>
                {item.mineAmount}/{item.carryCapacity}
              </td>
              <td>{item.travelSpeed}</td>
              <td>{item.miningSpeed}</td>
              <td>
                {item.x},{item.y}
              </td>
              <td>{MinerStatusMap[item.status]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Rodal
        visible={popupVisible}
        onClose={hidePopup}
        width="782"
        height="480"
      >
        <h2>History of Miner 1</h2>
        {loading ? <Loader /> : <PopupContent historyList={historyList}/>}
      </Rodal>
    </div>
  );
};

export default MinerList;
