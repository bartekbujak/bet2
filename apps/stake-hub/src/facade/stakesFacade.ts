import { singleton, inject } from 'tsyringe';
import type { IStakeRepository } from '../data/repository/stakeRepository';
import type { StakeCreateDto, StakeDto } from '../dto/stakeDto';
import {StakeSelection} from "../model/stakeSelection";
import {Stake} from "../model/stake";
import {OddsHubClient} from "../service/oddsHubClient";
import { v4 as uuidv4 } from 'uuid';

@singleton()
export class StakesFacade {
    constructor(
        @inject('IStakeRepository') private stakesRepository: IStakeRepository,
        @inject(OddsHubClient) private oddsHubClient: OddsHubClient,
    ) {
    }

    public async getAllStakes(): Promise<StakeDto[]> {
        return this.stakesRepository.getAll();
    }

    public async createStake(data: StakeCreateDto): Promise<void> {
        const odds = await this.oddsHubClient.fetchEvents(false);
        const stakeUUID = uuidv4();
        const now = new Date();

        const stakeSelections = data.selections
            .filter(selection => odds.some(outcome => outcome.outcomeId === selection.outcomeId))
            .filter((selection) =>
                odds.some((outcome) =>
                    outcome.outcomeId === selection.outcomeId &&
                    new Date(outcome.startDate) > now
                )
            )
            .map((selection) => {
                const outcome = odds.find(outcome => outcome.outcomeId === selection.outcomeId)!;

                return new StakeSelection(
                    undefined,
                    stakeUUID,
                    selection.outcomeId,
                    `${outcome.marketKey} - ${outcome.name}`,
                    `${outcome.homeTeam} - ${outcome.awayTeam}`,
                    outcome.price,
                );
            });

        if (stakeSelections.length > 0 && data.stake > 0) {
            const stake = new Stake(stakeUUID, data.stake, stakeSelections)
            return this.stakesRepository.save(stake);
        } else {
            console.error('No active stake selection found or invalid stake');
        }
    }

    public async updateStakes(): Promise<void> {
        const outcomes = await this.oddsHubClient.fetchEvents(true);
        const selections = await this.stakesRepository.getPendingSelections();
        const winSelections: number[] = [];
        const lostSelections: number[] = [];

        for (const selection of selections) {
            const resolved = outcomes.find(o => o.outcomeId === selection.outcomeID);
            console.log(resolved);
            if (!resolved) continue;

            if (resolved.status === 'WIN') {
                winSelections.push(selection.id);
            } else if (resolved.status === 'LOST') {
                lostSelections.push(selection.id);
            }
        }
        await this.stakesRepository.updateSelections(winSelections,lostSelections);
    }
}
