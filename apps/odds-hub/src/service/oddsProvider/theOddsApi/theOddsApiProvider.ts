import axios, { AxiosInstance } from "axios";
import {Competition, Event, IOddsProvider, Market} from "../oddsProvider";
import {inject, injectable} from "tsyringe";

interface Sport {
    key: string;
    group: string;
    title: string;
    description: string;
    active: boolean;
    has_outrights: boolean;
}

interface Bookmaker {
    key: string;
    title: string;
    last_update: string;
    markets: Market[];
}

interface TheOddsEvent {
    id: string;
    sport_key: string;
    commence_time: string;
    home_team: string;
    away_team: string;
    bookmakers: Bookmaker[];
}

@injectable()
export class TheOddsApiProvider implements IOddsProvider{
    private axiosInstance: AxiosInstance;

    constructor(
        @inject("THE_ODDS_API_URL") apiUrl: string,
        @inject("THE_ODDS_API_KEY") apiKey: string
    ) {
        this.axiosInstance = axios.create({
            baseURL: apiUrl,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.axiosInstance.interceptors.request.use((config) => {
            config.params = {
                ...config.params,
                apiKey: apiKey,
            };
            return config;
        });
    }

    public async fetchCompetitions(): Promise<Competition[]> {
        try {
            const response = await this.axiosInstance.get<Sport[]>("/v4/sports/");
            return response.data.map((sport) => ({
                id: sport.key,
                sport: sport.group,
                name: sport.title,
            }));
        } catch (error) {
            console.error("Błąd podczas pobierania konkurencji:", error);
            return [];
        }
    }


    public async fetchEvents(competitionId: string): Promise<Event[]> {
        try {
            const response = await this.axiosInstance.get<TheOddsEvent[]>(
                `/v4/sports/${competitionId}/odds?regions=eu&markets=h2h`
            );

            return response.data.map((sport) => ({
                id: sport.id,
                competitionId: sport.sport_key,
                startTime: sport.commence_time,
                home_team: sport.home_team,
                away_team: sport.away_team,
                odds: sport.bookmakers.length > 0 && sport.bookmakers[0].markets
                    ? sport.bookmakers[0].markets
                    : []
            }));
        } catch (error) {
            console.error("Błąd podczas pobierania konkurencji:", error);
            return [];
        }
    }

}