import {inject, singleton} from 'tsyringe';
import type {IOddsRepository} from "../data/repository/oddsRepository";
import type {Competition, IOddsProvider} from "../service/oddsProvider/oddsProvider";
import {OddsDto} from "../dto/oddsDto";

@singleton()
export class OddsFacade {
    constructor(
        @inject('IOddsRepository') private oddsRepository: IOddsRepository,
        @inject('IOddsProvider') private oddsProvider: IOddsProvider,
    ) {}

    public async getOdds(excludePending: boolean): Promise<OddsDto[]> {
        return this.oddsRepository.getEvents(excludePending);
    }

    public async refreshEvents(): Promise<void> {
        // const competitions = await this.oddsProvider.fetchCompetitions();

        //Due to the limitations of the test account, I'm temporarily fetching only upcoming football matches.
        const competitions: Competition[] = [{sport: 'soccer', id: 'soccer', name: 'soccer'}];
        await Promise.all(
            competitions.map((competition) => this.refreshCompetitionEvents(competition.id))
        );
    }

    public async refreshCompetitionEvents(competitionId: string): Promise<void> {
        const events = await this.oddsProvider.fetchEvents(competitionId);
        await this.oddsRepository.saveEvents(events, competitionId);
    }

    public async updateScores(): Promise<void> {
        await this.oddsRepository.updateScores();
    }
}