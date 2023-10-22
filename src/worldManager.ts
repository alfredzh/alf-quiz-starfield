import Asteroid, { AsteroidStatus } from "./asteroid";
import { INIT_ASTEROIDS, INIT_MINERS, INIT_PLANETS } from "./initData";
import Miner from "./miner";
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
    return this.planets.map((item) => item.getAllMiners());
  }

  public getAllPlanets() {
    return this.planets;
  }

  public getAllAsteroids() {
    return this.asteroids;
  }

  public createMiner() {
    //
  }

  public getMinerById(id: string) {
    let curr: Miner | undefined;
    this.planets.forEach((item) => {
      curr = item.getAllMiners().find((miner) => miner.id === id);
    });
    return curr;
  }

  public getMinersByPlanetId(planetId: string) {}

  private bindEvent() {
    myEmitter.on("findAvailableAsteroid", ({ minerId }) => {
      const curr = this.asteroids.find(
        (item) => item.status === AsteroidStatus.HasMinerals && !item.hasMiner
      );
      curr?.bindMiner(minerId);
    });
  }

  public start() {
    this.bindEvent();

    setInterval(() => {
      this.year += 1;

      myEmitter.emit("minerRun");
    }, 1000);
  }
}
