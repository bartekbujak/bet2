import path from "path";
import {google} from "googleapis";

const KEYFILEPATH = path.join(__dirname, '../../service-account.json');
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
];

export const placeTabHandler = async (spreadsheetId: string) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES,
    });
    const sheets = google.sheets('v4');
    google.options({auth: auth});

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Place Bet!A1',
        valueInputOption: 'RAW',
        requestBody: {
            values: [
                ['Note: The bet will be processed one minute after stake is entered'],
                ['OutcomeID', 'Stake'],
            ],
        },
    });
};