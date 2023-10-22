/**
 * Create miner popup
 */

import React, { useState } from "react";

const CreateMiner = (props) => {
  const [isNameExist, setIsNameExist] = useState(false);
  const [carryCapacity, setCarryCapacity] = useState(0);
  const [travelSpeed, setTravelSpeed] = useState(0);
  const [miningSpeed, setMiningSpeed] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const limit = 120;

  const computePoints = () => {
    setTotalPoints(carryCapacity + travelSpeed + miningSpeed);
  };

  const updatePoints = (key, value) => {
    value = parseInt(value, 10);
    if (value < 1) value = 0;

    switch (key) {
      case "carryCapacity":
        setCarryCapacity(value);
        break;
      case "travelSpeed":
        setTravelSpeed(value);
        break;
      case "miningSpeed":
        setMiningSpeed(value);
        break;
      default:
        break;
    }

    computePoints();
  };

  const onSubmit = async (e) => {
    e.preventDefault();

	const formElements = e.target.elements;
    const data = {};

    for (let element of formElements) {
      if (element.id) {
        data[element.id] = element.value;
      }
    }

    try {
      const res = await fetch("http://localhost:3000/miners", {
        method: "post",
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify(data)
      });
      if (res.ok) {
        const res = await res.json();
		console.log(res)
      }
    } catch {}
  };

  return (
    <form onSubmit={onSubmit}>
      <div class="field error">
        <label for="name">Miner name</label>
        <input type="text" id="name" placeholder="Miner name" />
        {isNameExist && (
          <div className="message">This name is already taken</div>
        )}
      </div>

      <div class="field">
        <label for="planet">Planet</label>
        <select placeholder="Select a planet" id="planet">
          {props.planets.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>

      <h2>Assign points</h2>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label htmlFor="carry-capacity">Carry capacity</label>
            <input
              value={carryCapacity}
              type="number"
              id="carry-capacity"
              placeholder="0"
              onChange={(e) => updatePoints("carryCapacity", e.target.value)}
            />
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label htmlFor="travel-speed">Travel speed</label>
            <input
              value={travelSpeed}
              type="number"
              id="travel-speed"
              placeholder="0"
              onChange={(e) => updatePoints("travelSpeed", e.target.value)}
            />
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label htmlFor="mining-speed">Mining speed</label>
            <input
              value={miningSpeed}
              type="number"
              id="mining-speed"
              placeholder="0"
              onChange={(e) => updatePoints("miningSpeed", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={totalPoints <= limit ? "green" : "red"}>
        {totalPoints}/{limit}
      </div>
      <div className="actions">
        <button>Save</button>
      </div>
    </form>
  );
};

export default CreateMiner;
