export interface StakeDto {
    id: string;
    stake: number;
    total: number;
    selections: {
        id: number;
        stakeId: string;
        outcomeID: number;
        price: number;
        eventName: string;
        marketName: string;
    }[]
}

export interface SelectionDto {
    id: number;
    stakeId: string;
    outcomeID: number;
    price: number;
    eventName: string;
    marketName: string;
}

export interface StakeCreateDto {
    stake: number;
    selections: StakeSelectionCreateDto[];
}

export interface StakeSelectionCreateDto {
    outcomeId: number;
}
