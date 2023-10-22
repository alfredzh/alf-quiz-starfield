import Miner from "./miner";
import { myEmitter } from "./worldManager";

export default class Planet {
  public readonly id: string;
  private readonly name: string;
  public readonly x: number;
  public readonly y: number;
  private minerals = 0;
  private miners: Miner[] = [];

  constructor(x: number, y: number, name: string, id: string) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.name = name;
    this.bindEvent();
  }

  public spawnMiner(
    x: number,
    y: number,
    id: string,
    carryCapacity: number,
    travelSpeed: number,
    miningSpeed: number
  ) {
    this.miners.push(
      new Miner(
        x,
        y,
        id,
        carryCapacity,
        travelSpeed,
        miningSpeed,
        this.id,
        this.name
      )
    );
  }

  public getAllMiners() {
    return this.miners;
  }

  private bindEvent() {
    myEmitter.on("transferDone", ({ planetId, minerals }) => {
      if (this.id !== planetId) {
        return;
      }
      this.minerals += minerals;

      myEmitter.emit("planetUpdate", this);
    });
  }
}
