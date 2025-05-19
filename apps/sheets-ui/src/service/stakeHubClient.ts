import {inject, singleton} from "tsyringe";
import axios, {AxiosInstance} from "axios";

export interface Selections {
    outcomeId: number;
    stake: number;
}

export interface StakeResponse {
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
        status: string;
    }[]
}


@singleton()
export class StakeHubClient {
    private axiosInstance: AxiosInstance;

    constructor(
        @inject("STAKE_HUB_API_URL") apiUrl: string,
    ) {
        this.axiosInstance = axios.create({
            baseURL: apiUrl,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    public async placeBet(selections: Selections): Promise<void> {
        try {
            const response = await this.axiosInstance.post("/api/stake/", {
                stake : selections.stake,
                selections: [
                    {outcomeId : selections.outcomeId},
                ]
            });

            return response.data
        } catch (error) {
            console.error("Error:", error);
        }
    }

    public async getHistory(): Promise<StakeResponse[]> {
        try {
            const response = await this.axiosInstance.get<StakeResponse[]>("/api/stake/");

            return response.data;
        } catch (error) {
            console.error("Error:", error);
            return [];
        }
    }
}