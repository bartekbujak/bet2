import {inject, singleton} from "tsyringe";
import axios, {AxiosInstance} from "axios";

export interface Outcome {
    eventId: string;
    competitionId: string;
    startDate: string;
    homeTeam: string;
    awayTeam: string;
    outcomeId: number;
    marketKey: string;
    name: string;
    price: number;
    point: number | null;
    status: string;
}

@singleton()
export class OddsHubClient {
    private axiosInstance: AxiosInstance;

    constructor(
        @inject("ODDS_HUB_API_URL") apiUrl: string,
    ) {
        this.axiosInstance = axios.create({
            baseURL: apiUrl,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public async fetchEvents(pending: boolean): Promise<Outcome[]> {
        try {
            const response = await this.axiosInstance.get<Outcome[]>(`/api/odds?excludePending=${pending}`);

            return response.data
        } catch (error) {
            console.error("Error:", error);
            return [];
        }
    }
}