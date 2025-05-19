import { Router } from 'express';
import { container } from 'tsyringe';
import { StakesController } from './stakesController';

const router: Router = Router();

export const initializeRouters = (): Router => {
    const stakesController = container.resolve(StakesController);
    router.get('/stake', stakesController.getAll);
    router.post('/stake', stakesController.create);

    return router;
};