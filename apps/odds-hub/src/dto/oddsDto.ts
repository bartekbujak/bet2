export interface OddsDto {
    eventId: string;
    competitionId: string;
    marketKey: string;
    startDate: Date;
    homeTeam: string;
    awayTeam: string;
    outcomeId: string;
    name: string;
    price: number;
    point: number|null;
    status: string;
}