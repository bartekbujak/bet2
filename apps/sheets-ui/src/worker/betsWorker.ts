import { google } from 'googleapis';
import {container} from "tsyringe";
import {Selections, StakeHubClient} from "../service/stakeHubClient";

export const placeBetsWorker = async (spreadsheetId: string): Promise<void> => {
    console.log('[placeBetsWorker] Start:', new Date().toISOString());

    const auth = new google.auth.GoogleAuth({
        keyFile: './service-account.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets('v4');
    google.options({ auth: auth });

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Place Bet!A3:G1000',
    });
    const rows = response.data.values ?? [];

    const bets: Selections[] = rows.map((row): Selections => ({
        outcomeId: Number(row[0]),
        stake: Number([1]),
    }));

    const stakeHubClient = container.resolve(StakeHubClient);
    await Promise.allSettled(
        bets.map(bet => stakeHubClient.placeBet(bet))
    );

    await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: 'Place Bet!A3:G1000',
    });

};
