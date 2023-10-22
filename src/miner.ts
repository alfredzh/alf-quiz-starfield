import { calculateNewCoordinates } from "./utils";
import { myEmitter } from "./worldManager";

export enum MinerStatus {
  Idle,
  Traveling,
  Mining,
  Transfering,
}

const CARRY_CAPACITY_RANGE = {
  min: 1,
  max: 200,
};

const TRAVEL_SPEED_RANGE = {
  min: 1,
  max: 200,
};

const MINING_SPEED_RANGE = {
  min: 1,
  max: 200,
};

export default class Miner {
  public readonly id: string;
  private readonly planetId: string;
  private readonly planetName: string;
  private originX: number;
  private originY: number;
  private x: number;
  private y: number;
  private mineAmount = 0;
  private readonly carryCapacity: number;
  private readonly travelSpeed: number;
  private readonly miningSpeed: number;
  public status = MinerStatus.Idle;
  private isSearchingAsteroid = false;
  private targetAsteroidId?: string;
  private targetX?: number;
  private targetY?: number;
  private miningYear = 0;

  constructor(
    x: number,
    y: number,
    id: string,
    carryCapacity: number,
    travelSpeed: number,
    miningSpeed: number,
    planetId: string,
    planetName: string
  ) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.carryCapacity = carryCapacity;
    this.travelSpeed = travelSpeed;
    this.miningSpeed = miningSpeed;
    this.planetId = planetId;
    this.planetName = planetName;
    this.spawn();

    this.bindEvent();
  }

  private move() {
    if (this.targetX === undefined || this.targetY === undefined) {
      return;
    }
    const pos = calculateNewCoordinates(
      this.x,
      this.y,
      this.targetX,
      this.targetY,
      this.travelSpeed
    );
    let nextX = Math.floor(pos.x);
    let nextY = Math.floor(pos.y);
    if (Math.abs(nextX - this.targetX) <= this.travelSpeed) {
      nextX = this.targetX;
    }
    if (Math.abs(nextY - this.targetY) <= this.travelSpeed) {
      nextY = this.targetY;
    }
    this.x = nextX;
    this.y = nextY;

    if (this.x === this.targetX && this.y === this.targetY) {
      this.status = MinerStatus.Mining;
    }
  }

  private transfer() {
    const pos = calculateNewCoordinates(
      this.x,
      this.y,
      this.originX,
      this.originY,
      this.travelSpeed
    );

    let nextX = Math.floor(pos.x);
    let nextY = Math.floor(pos.y);
    if (Math.abs(nextX - this.originX) <= this.travelSpeed) {
      nextX = this.originX;
    }
    if (Math.abs(nextY - this.originY) <= this.travelSpeed) {
      nextY = this.originY;
    }
    this.x = nextX;
    this.y = nextY;

    if (this.x === this.originX && this.y === this.originY) {
      if (this.id === "Alpha") {
        console.log(this.x, this.y, this.mineAmount, "transfer done");
      }

      myEmitter.emit("transferDone", {
        planetId: this.planetId,
        minerals: this.mineAmount,
      });
      this.mineAmount = 0;
      this.status = MinerStatus.Idle;

      this.log(`Transfering minerals to planet ${this.planetId}`);
    }

    this.log(
      `Traveling back from asteroid ${this.targetAsteroidId} to ${this.planetName}`
    );
  }

  private mine() {
    this.miningYear += 1;
    const capacityRemaining = Math.abs(this.carryCapacity - this.mineAmount);
    let amound = this.miningSpeed;
    if (this.miningSpeed > capacityRemaining) {
      amound = capacityRemaining;
    }

    myEmitter.emit("mineAsteroid", {
      amound,
      minerId: this.id,
    });

    this.log(
      `Mining asteroid ${this.targetAsteroidId} for ${this.miningYear} years`
    );
  }

  private bindEvent() {
    myEmitter.on("minerRun", () => {
      switch (this.status) {
        case MinerStatus.Idle:
          if (this.isSearchingAsteroid) {
            return;
          }
          this.isSearchingAsteroid = true;
          myEmitter.emit("findAvailableAsteroid", { minerId: this.id });
          break;
        case MinerStatus.Traveling:
          this.move();
          break;
        case MinerStatus.Mining:
          this.mine();
          break;
        case MinerStatus.Transfering:
          this.transfer();
          break;
      }
    });

    myEmitter.on("bindMinerSuccess", ({ minerId, asteroidId, x, y }) => {
      if (this.id !== minerId) {
        return;
      }
      this.targetX = x;
      this.targetY = y;
      this.status = MinerStatus.Traveling;
      this.isSearchingAsteroid = false;
      this.targetAsteroidId = asteroidId;

      this.log(
        `Traveling from planet ${this.planetName} to asteroid ${this.targetAsteroidId}`
      );
    });

    myEmitter.on("mineAsteroidSuccess", ({ minerId, amount, isDepleted }) => {
      if (this.id !== minerId) {
        return;
      }

      this.mineAmount += amount;
      if (this.mineAmount === this.carryCapacity) {
        this.status = MinerStatus.Transfering;
      }
      if (isDepleted) {
        this.status = MinerStatus.Transfering;
      }
    });
  }

  private spawn() {
    this.log(`Miner spawn on planet ${this.planetId}`);
  }

  private log(message: string) {
    console.log(message);
    // TODO save message to database
  }

  fireRun() {}
}
