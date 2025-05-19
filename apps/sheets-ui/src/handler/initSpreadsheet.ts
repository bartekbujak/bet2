import {createSpreadsheet} from "./createSpreadsheet";

async function run() {
    try {
        await createSpreadsheet();
        console.log('Spreadsheet created successfully. Copy the spreadsheet ID from the response and set it in your .env file as SPREADSHEET_ID.');
    } catch (err) {
        console.error('error:', err);
    }
}

run().then(() => {
    console.log('Spreadsheet prepare successfully.');
});
