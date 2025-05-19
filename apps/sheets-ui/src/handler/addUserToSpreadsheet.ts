import { google } from 'googleapis';
import path from 'path';

const KEYFILEPATH = path.join(__dirname, '../../service-account.json');
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
];

export async function addUserToSpreadsheet(spreadsheetId: string, email: string): Promise<void> {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES,
    });

    const drive = google.drive('v3');
    google.options({auth: auth});

    await drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: {
            role: 'writer',
            type: 'user',
            emailAddress: email
        }
    });
}
