import { google } from 'googleapis';
import path from 'path';

const KEYFILEPATH = path.join(__dirname, '../../service-account.json');
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
];

export async function createSpreadsheet(): Promise<void> {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES,
    });

    const sheets = google.sheets('v4');
    google.options({auth: auth});

    const res = await sheets.spreadsheets.create({
        requestBody: {
            properties: {
                title: "Betting Spreadsheet"
            }
        }
    });

    console.log(res);
}
