import { google } from 'googleapis';
import {container} from "tsyringe";
import {OddsHubClient} from "../service/oddsHubClient";

export const eventsWorker = async (spreadsheetId: string): Promise<void> => {
    const auth = new google.auth.GoogleAuth({
        keyFile: './service-account.json',
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets('v4');
    google.options({ auth: auth });

    await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: 'Events!A2:G1000',
    });


    const oddsHubClient = container.resolve(OddsHubClient);
    const result = await oddsHubClient.fetchEvents(false);
    const rows = result.map((o) => [
        o.outcomeId,
        o.competitionId,
        o.startDate,
        o.homeTeam,
        o.awayTeam,
        o.name,
        o.price,
        o.point ?? '',
    ]);

    await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Events!A2',
        valueInputOption: 'RAW',
        requestBody: {
            values: rows,
        },
    });
};
