import {StakeSelection} from "./stakeSelection";

export class Stake {
    public total: number;
    public status: string;

    constructor(
        public id: string,
        public readonly stake: number,
        public selections: StakeSelection[] = []
    ) {
        const totalOdds = this.selections.reduce((acc, sel) => acc * sel.price, 1);
        this.total = parseFloat((totalOdds * this.stake).toFixed(2));
        this.status = 'PENDING'
    }
}