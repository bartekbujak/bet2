import 'reflect-metadata';
import express from 'express';
import {initialDbContext} from './data/dbContext';
import dotenv from 'dotenv';
import {container} from "tsyringe";
import { initializeRouters } from "./controller/routes";
import {resolveStakesWorker} from "./worker/score.worker";

dotenv.config();

const startupApp = async () => {
  const app = express();
  container.registerInstance("ODDS_HUB_API_URL", process.env.ODDS_HUB_API_URL as string);
  await initialDbContext(process.env.DATABASE_URL as string);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', initializeRouters());
  const server = app.listen(3004, () => {
    console.log('Listening on port 3004');
  });

  setInterval(() => {
    resolveStakesWorker();
  }, 3600000);

  process.on('SIGINT', async () => {
    server.close();
    console.log('Application shutdown successfully.');
  });
};

startupApp();