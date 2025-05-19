import 'reflect-metadata';
import express from 'express';
import {initialDbContext} from './data/dbContext';
import dotenv from 'dotenv';
import {container} from "tsyringe";
import {TheOddsApiProvider} from "./service/oddsProvider/theOddsApi/theOddsApiProvider";
import { initializeRouters } from "./controller/routes";

dotenv.config();

const startupApp = async () => {
  const app = express();
  await initialDbContext(process.env.DATABASE_URL as string);
  container.registerInstance("THE_ODDS_API_URL", process.env.THE_ODDS_API_URL as string);
  container.registerInstance("THE_ODDS_API_KEY", process.env.THE_ODDS_API_KEY as string);
  container.register("IOddsProvider", { useClass: TheOddsApiProvider });
  container.register("IOddsProvider", { useClass: TheOddsApiProvider });

  app.use('/api', initializeRouters());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const server = app.listen(3003, () => {
    console.log('Listening on port 3003');
  });

  process.on('SIGINT', async () => {
    server.close();
    console.log('Application shutdown successfully.');
  });
};

startupApp();