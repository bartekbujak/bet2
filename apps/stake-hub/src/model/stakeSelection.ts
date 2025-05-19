export class StakeSelection {
    public status: string;

    constructor(
        public id: number | undefined,
        public stakeId: string,
        public outcomeId: number,
        public marketName: string,
        public eventName: string,
        public price: number,
    ) {
        this.status = 'PENDING';
    }
}