import 'reflect-metadata';
import {placeBetsWorker} from "./worker/betsWorker";
import {eventsWorker} from "./worker/eventsWorker";
import dotenv from "dotenv";
import {container} from "tsyringe";
import {historyWorker} from "./worker/historyWorker";

dotenv.config();
container.registerInstance("ODDS_HUB_API_URL", process.env.ODDS_HUB_API_URL as string);
container.registerInstance("STAKE_HUB_API_URL", process.env.STAKE_HUB_API_URL as string);
container.registerInstance("SPREED_SHEET_ID", process.env.SPREED_SHEET_ID as string);

async function runWorkers() {
    try {
        const spreadsheetId = process.env.SPREED_SHEET_ID as string;
        await placeBetsWorker(spreadsheetId);
        await historyWorker(spreadsheetId);
        await eventsWorker(spreadsheetId);
    } catch (err) {
        console.error('Worker error:', err);
    }
}

setInterval(runWorkers, 60_000);
