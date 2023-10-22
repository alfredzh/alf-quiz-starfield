import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import WorldManager, { myEmitter } from "./worldManager";
import bodyParser from "body-parser";
import connectDB from "./db";
import History from "./models/history";

const app = express();
app.use(cors());
app.use(bodyParser.json());

async function init() {
  await connectDB();

  const world = new WorldManager();
  world.start();

  app.get("/miners", function (req, res) {
    if (req.query.planetId && typeof req.query.planetId === "string") {
      res.send(world.getMinersByPlanetId(req.query.planetId));
      return;
    }

    res.send(world.getMiners().flat());
  });

  app.get("/miners/:id", function (req, res) {
    const curr = world
      .getMiners()
      .flat()
      .find((item) => item.id === req.params.id);

    res.send({ miner: curr });
  });

  app.post("/miners", function (req, res) {
    const data = req.body;
    world.createMiner({
      minerId: data.name,
      planetId: data.planet,
      carryCapacity: data["carry-capacity"],
      travelSpeed: data["travel-speed"],
      miningSpeed: data["mining-speed"],
    });
    res.send({ miners: world.createMiner });
  });

  app.get("/planets", function (req, res) {
    res.send(world.getAllPlanets());
  });

  app.get("/asteroids", function (req, res) {
    res.send(world.getAllAsteroids());
  });

  app.get("/miners/:id/history", async function (req, res) {
    const findResult = await History.find({ minerId: req.params.id });
    res.send(findResult);
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
      ws.send(JSON.stringify({ message: "minerUpdate", miner }));
    });

    myEmitter.on("asteroidUpdate", (asteroid) => {
      ws.send(JSON.stringify({ message: "asteroidUpdate", asteroid }));
    });

    myEmitter.on("planetUpdate", (planet) => {
      ws.send(JSON.stringify({ message: "planetUpdate", planet }));
    });
  });

  app.listen(3000);
}

init();
