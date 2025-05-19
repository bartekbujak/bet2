import { container } from 'tsyringe';
import {StakesFacade} from "../facade/stakesFacade";

export const resolveStakesWorker = async () => {
    try {
        const facade = container.resolve(StakesFacade);
        await facade.updateStakes();
    } catch (err) {
        console.error('Error:', err);
    }
};
