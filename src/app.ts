import express from "express";
import WorldManager from "./worldManager";
const app = express();

const world = new WorldManager();
world.start()

// GET /miners: return the list of miners
// GET /miners?planetId=[planet ID]: return the list of miners from a given planet ID
app.get("/miners", function (req, res) {
  // planetId
  console.log(req.query.planetId);
  if (req.query.planetId && typeof req.query.planetId === 'string') {
    res.send({ miners: world.getMinersByPlanetId(req.query.planetId) });
    return;
  }

  res.send({ miners: world.getMiners() });
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

app.listen(3000);
