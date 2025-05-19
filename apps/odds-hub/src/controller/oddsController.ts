import {inject, singleton} from 'tsyringe';
import { Request, Response } from 'express';
import {OddsFacade} from "../facade/oddsFacade";

@singleton()
export class OddsController {
    constructor(
        @inject(OddsFacade) private oddsFacade: OddsFacade
    ) {}

    public getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const excludePending = req.query.excludePending === 'true';
            const result = await this.oddsFacade.getOdds(excludePending);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    public updateScores = async (req: Request, res: Response): Promise<Response> => {
        try {
            await this.oddsFacade.updateScores();
            return res.status(200).json({"status": "success"});
        } catch (error) {
            console.error('Error during scores update:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    public refresh = async (req: Request, res: Response): Promise<Response> => {
        try {
            await this.oddsFacade.refreshEvents();
            return res.status(201).json({ message: 'Events refreshed successfully' });
        } catch (error) {
            console.error('Error during events refresh:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}