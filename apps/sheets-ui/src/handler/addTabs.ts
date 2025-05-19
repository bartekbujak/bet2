import { google } from 'googleapis';

const KEYFILEPATH = 'service-account.json';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export const addTabs = async (spreadsheetId: string) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES,
    });

    const sheets = google.sheets('v4');
    google.options({ auth: auth });

    try {
        const response = await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
                requests: [
                    {
                        addSheet: {
                            properties: {
                                title: 'Events',
                            },
                        },
                    },
                    {
                        addSheet: {
                            properties: {
                                title: 'Place Bet',
                            },
                        },
                    },
                    {
                        addSheet: {
                            properties: {
                                title: 'Bet History',
                            },
                        },
                    },
                ],
            },
        });

        console.log('Tabs added successfully:', response.data);
    } catch (error) {
        console.error('Error adding tabs:', error);
    }
};
