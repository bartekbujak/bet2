import { Router } from 'express';
import { container } from 'tsyringe';
import { OddsController } from './oddsController';

const router: Router = Router();

export const initializeRouters = (): Router => {
    const oddsController = container.resolve(OddsController);
    router.get('/odds', oddsController.getAll);
    /**
     * The refresh and generate method should use the POST method
     * I'm keeping GET only for easy triggering of the refresh without using curl for testing purposes.
     */
    router.get('/odds/refresh', oddsController.refresh);
    router.get('/odds/generate', oddsController.updateScores);

    return router;
};