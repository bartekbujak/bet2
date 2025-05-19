export interface IOddsProvider {
    fetchEvents(competitionId: string): Promise<Event[]>
    fetchCompetitions(): Promise<Competition[]>
}

export interface Competition {
    id: string;
    sport: string;
    name: string;
}

export interface Event {
    id: string;
    competitionId: string;
    startTime: string;
    home_team: string;
    away_team: string;
    odds: Market[];
}

export interface Outcome {
    name: string;
    price: number;
    point?: number;
}

export interface Market {
    key: string;
    outcomes: Outcome[];
}