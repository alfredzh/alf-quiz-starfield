import express from "express";
import cors from "cors";
import WebSocket, { WebSocketServer } from "ws";
import WorldManager, { myEmitter } from "./worldManager";

const app = express();
app.use(cors());

const world = new WorldManager();
world.start();

// GET /miners: return the list of miners
// GET /miners?planetId=[planet ID]: return the list of miners from a given planet ID
app.get("/miners", function (req, res) {
  // planetId
  console.log(req.query.planetId);
  if (req.query.planetId && typeof req.query.planetId === "string") {
    res.send(world.getMinersByPlanetId(req.query.planetId));
    return;
  }

  res.send(world.getMiners().flat());
});

// GET /miners/[miner ID]: return a miner based on its ID
app.get("/miners/:id", function (req, res) {
  // planetId
  console.log(req.params.id);

  res.send({ miners: world.getMiners() });
});

// POST /miners: create a miner
app.post("/miners", function (req, res) {
  world.createMiner();
  res.send({ miners: world.createMiner });
});

// PUT /miners/[miner ID]: update a miner based on its ID
app.put("/miners/:id", function (req, res) {});

// DELETE /miners/[miner ID]: delete a miner based on its ID
app.delete("/miners/:id", function (req, res) {});

app.get("/planets", function (req, res) {
  res.send(world.getAllPlanets());
});

app.get("/asteroids", function (req, res) {
  res.send(world.getAllAsteroids());
});

const wss = new WebSocketServer({
  port: 3100,
});

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  myEmitter.on("minerUpdate", (miner) => {
    ws.send(JSON.stringify({message: 'minerUpdate', miner}))
  });

  myEmitter.on("asteroidUpdate", (asteroid) => {
    ws.send(JSON.stringify({message: 'asteroidUpdate', asteroid}))
  });
});

app.listen(3000);
