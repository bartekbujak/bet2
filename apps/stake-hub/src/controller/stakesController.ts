import { inject, singleton } from 'tsyringe';
import { Request, Response } from 'express';
import { StakesFacade } from '../facade/stakesFacade';

@singleton()
export class StakesController {
    constructor(
        @inject(StakesFacade) private stakesFacade: StakesFacade
    ) {}

    public getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const stakes = await this.stakesFacade.getAllStakes();
            return res.status(200).json(stakes);
        } catch (error) {
            console.error('Error fetching stakes:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    public create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const stakeData = req.body;
            const newStake = await this.stakesFacade.createStake(stakeData);
            return res.status(201).json(newStake);
        } catch (error) {
            console.error('Error creating stake:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}
