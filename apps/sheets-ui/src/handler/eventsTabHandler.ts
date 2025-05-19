import path from "path";
import {google} from "googleapis";

const KEYFILEPATH = path.join(__dirname, '../../service-account.json');
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
];

export const eventsTabHandler = async (spreadsheetId: string) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES,
    });
    const sheets = google.sheets('v4');
    google.options({auth: auth});

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Events!A1',
        valueInputOption: 'RAW',
        requestBody: {
            values: [[
                'Outcome ID',
                'Competition ID',
                'Start Date',
                'Home Team',
                'Away Team',
                'Outcome Name',
                'Price',
                'Point',
            ]],
        },
    });
};