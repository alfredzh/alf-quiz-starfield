// import { getRandomIntInclusive } from "./utils";

import { myEmitter } from "./worldManager";

export enum AsteroidStatus {
  Depleted,
  HasMinerals,
}

// const MINERAL_AMOUNT_RANGE = {
//   min: 800,
//   max: 1200,
// };

export default class Asteroid {
  private id: string;
  public x: number;
  public y: number;
  public mineralAmount: number;
  public status = AsteroidStatus.HasMinerals;
  private minerId?: string;

  constructor(x: number, y: number, id: string, mineralAmount: number) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.mineralAmount = mineralAmount;
    this.bindEvent();
  }

  public checkMineralAmount() {
    if (this.mineralAmount === 0) {
      this.status = AsteroidStatus.Depleted;
    }
  }

  public bindMiner(minerId: string) {
    this.minerId = minerId;
    console.log("bindMinerSuccess");
    myEmitter.emit("bindMinerSuccess", {
      minerId: minerId,
      asteroidId: this.id,
      x: this.x,
      y: this.y,
    });
  }

  public get hasMiner() {
    return this.minerId !== undefined;
  }

  private bindEvent() {
    myEmitter.on("mineAsteroid", ({ minerId, amound }) => {
      if (this.minerId !== minerId) {
        return;
      }
      let successAmount = amound;
      let isDepleted = false;
      if (amound <= this.mineralAmount) {
        this.mineralAmount -= amound;
      } else {
        successAmount = this.mineralAmount;
        this.mineralAmount = 0;
        this.status = AsteroidStatus.Depleted;
        isDepleted = true
      }

      
      myEmitter.emit("mineAsteroidSuccess", { minerId, amount: successAmount, isDepleted });
    });
  }
}
