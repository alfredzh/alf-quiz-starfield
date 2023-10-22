import mongoose from "mongoose";

const schema = new mongoose.Schema({
  createdAt: Date,
  year: Number,
  planet: String,
  carryCapacity: Number,
  travelSpeed: Number,
  miningSpeed: Number,
  x: Number,
  y:Number,
  minerId: String,
  status: String,
});

const History = mongoose.model("History", schema);

export default History;
