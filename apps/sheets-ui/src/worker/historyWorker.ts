import { google } from 'googleapis';
import {container} from "tsyringe";
import {StakeHubClient} from "../service/stakeHubClient";

const STATUSES: Record<string, string> = {
    pending: '⌛',
    win: '✅',
    lost: '❌',
};


export const historyWorker = async (spreadsheetId: string): Promise<void> => {
    const auth = new google.auth.GoogleAuth({
        keyFile: './service-account.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets('v4');
    google.options({ auth: auth });

    await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: 'Bet History!A1:G1000',
    });


    const stakeHubClient = container.resolve(StakeHubClient);
    const result = await stakeHubClient.getHistory();
    const rows: string[][] = result.flatMap((stake) => [
        [`${STATUSES.pending} Bet ID: ${stake.id}`],

        ...stake.selections.map((selection) => [
            `${selection.eventName} ${STATUSES[selection.status]}`,
            `${selection.marketName}`,
            `${selection.price.toFixed(2)}`
        ]),

        [
           'Stake:', stake.stake.toFixed(2),
        ],
        [
            'Total to win:', stake.total.toFixed(2),
        ],
        []
    ]);

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Bet History!A1',
        valueInputOption: 'RAW',
        requestBody: {
            values: rows,
        },
    });
};
