import Asteroid, { AsteroidStatus } from "./asteroid";
import { INIT_ASTEROIDS, INIT_MINERS, INIT_PLANETS } from "./initData";
import Planet from "./planet";
import EventEmitter from "events";



export const myEmitter = new EventEmitter();

export default class WorldManager {
  readonly MAX_ROW_SIZE = 1000;
  readonly MAX_COL_SIZE = 1000;
  private year = 0;
  private planets: Planet[] = [];
  private asteroids: Asteroid[] = [];

  constructor() {
    this.initPlanet();
    this.initAsteroids();
  }
  private initPlanet() {
    for (let i = 0; i < INIT_PLANETS.length; i++) {
      const currPlanetData = INIT_PLANETS[i];
      const planet = new Planet(
        currPlanetData.position.x,
        currPlanetData.position.y,
        currPlanetData.name,
        currPlanetData.id.toString()
      );
      for (let j = 0; j < 3; j++) {
        const minerIndex = INIT_PLANETS.length * i + j;
        const currMinerData = INIT_MINERS[minerIndex];
        planet.spawnMiner(
          currPlanetData.position.x,
          currPlanetData.position.y,
          currMinerData.name,
          currMinerData.carryCapacity,
          currMinerData.travelSpeed,
          currMinerData.miningSpeed
        );
      }

      this.planets.push(planet);
    }
  }
  private initAsteroids() {
    for (let i = 0; i < INIT_ASTEROIDS.length; i++) {
      const currData = INIT_ASTEROIDS[i];

      const asteroid = new Asteroid(
        currData.position.x,
        currData.position.y,
        currData.name,
        currData.minerals
      );
      this.asteroids.push(asteroid);
    }
  }

  public getMiners() {
    for (const iterator of this.planets) {
    }
    return this.planets.map((item) => item.getAllMiners());
  }

  public createMiner() {
    //
  }

  public getMinersByPlanetId(planetId: string) {}

  private bindEvent() {
    myEmitter.on("findAvailableAsteroid", ({ minerId }) => {
      const curr = this.asteroids.find(
        (item) => item.status === AsteroidStatus.HasMinerals && !item.hasMiner
      );
      curr?.bindMiner(minerId);
    });

    // myEmitter.on("logMinerSpawn", ({ planetId }) => {
    //   this.logToDB(`Miner spawn on planet ${planetId}`);
    // });

    // myEmitter.on("logMinerTraveling", ({ planetId, asteroidId }) => {
    //   this.logToDB(
    //     `Traveling from planet ${planetId} to asteroid ${asteroidId}`
    //   );
    // });

    // myEmitter.on("logMinerTraveling", ({  asteroidId }) => {
    //   this.logToDB(
    //     `Mining asteroid ${asteroidId} for ${this} years`
    //   );
    // });
  }

  // private logToDB(msg: string) {
  //   console.log(msg);
  // }

  public start() {
    this.bindEvent();

    setInterval(() => {
      this.year += 1;

      myEmitter.emit("minerRun");

      //       for (const planet of this.planets) {
      //         for (const miner of planet.getAllMiners()) {
      //           switch(miner.status) {
      //             case MinerStatus.Idle:
      // // this.asteroids.find(item => item.status)
      //           }
      //         }
      //       }
      // this.planets.map(item => {
      //   item.getAllMiners().map(miner => {
      //     if (miner.status === )
      //   })
      // })
      //   console.log("started, year:", this.year);
    }, 1000);
  }
}
