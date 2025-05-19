import {eventsTabHandler} from "./eventsTabHandler";
import {placeTabHandler} from "./placeTabHandler";
import {addTabs} from "./addTabs";
import dotenv from "dotenv";
import {addUserToSpreadsheet} from "./addUserToSpreadsheet";

dotenv.config();

async function run() {
    try {
        const spreadsheetId = process.env.SPREED_SHEET_ID as string;
        const firstUserEmail = process.env.USER_EMAIL as string;
        await addTabs(spreadsheetId)
        await eventsTabHandler(spreadsheetId);
        await placeTabHandler(spreadsheetId);
        await addUserToSpreadsheet(spreadsheetId, firstUserEmail);
    } catch (err) {
        console.error('error:', err);
    }
}

run().then(() => {
    console.log('Spreadsheet prepared successfully.');
});
