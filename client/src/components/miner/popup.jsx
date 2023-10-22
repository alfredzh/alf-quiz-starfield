/**
 * Miner popup
 */

import React, { useEffect, useState } from "react";

const MinerPopup = (props) => {
  return (
    <div className="scrollable">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Year</th>
            <th>Planet</th>
            <th>Carry capacity</th>
            <th>Travel speed</th>
            <th>Mining speed</th>
            <th>Position (x, y)</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {props.historyList.map((item) => (
            <tr>
              <td>{item.createdAt}</td>
              <td>{item.year}</td>
              <td>{item.planet}</td>
              <td>{item.carryCapacity}</td>
              <td>{item.travelSpeed}</td>
              <td>{item.miningSpeed}</td>
              <td>{item.x}, {item.y}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MinerPopup;
