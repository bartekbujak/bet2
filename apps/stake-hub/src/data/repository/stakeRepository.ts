import {inject, singleton} from "tsyringe";
import type {IDbContext} from "../dbContext";
import {SelectionDto, StakeDto} from "../../dto/stakeDto";
import {Stake} from "../../model/stake";
import {stakes} from "../drizzle/schema/stakes";
import {stakeSelections} from "../drizzle/schema/stakeSelections";
import {eq, inArray} from "drizzle-orm";

export interface IStakeRepository {
    getAll(): Promise<StakeDto[]>;
    getPendingSelections(): Promise<SelectionDto[]>;
    save(stake: Stake): Promise<void>;
    updateSelections(winIds: number[], lostIds: number[]): Promise<void>;
}

@singleton()
export class DrizzleStakeRepository implements IStakeRepository {
    constructor(@inject("IDbContext") private readonly dbContext: IDbContext) {}

    getPendingSelections(): Promise<SelectionDto[]> {
        return this.dbContext.database
            .select()
            .from(stakeSelections)
            .where(eq(stakeSelections.status, 'PENDING'));
    }

    async getAll(): Promise<StakeDto[]> {
        return this.dbContext.database.query.stakes.findMany({
            with: {
                selections: true
            },
        });
    }


    async save(stake: Stake): Promise<void> {
        await this.dbContext.database.transaction(async (tx) => {
            await tx.insert(stakes).values({
                id: stake.id,
                stake: stake.stake,
                total: stake.total,
                status: stake.status,
            });

            await tx.insert(stakeSelections).values(
                stake.selections.map((selection) => ({
                    stakeId: stake.id,
                    outcomeID: selection.outcomeId,
                    price: selection.price,
                    eventName: selection.eventName,
                    marketName: selection.marketName,
                    status: selection.status,
                }))
            );
        });
    }

    public async updateSelections(winIds: number[], lostIds: number[]): Promise<void> {
        await this.dbContext.database.transaction(async (tx) => {
            if (winIds.length > 0) {
                await tx
                    .update(stakeSelections)
                    .set({status: 'WIN'})
                    .where(inArray(stakeSelections.id, winIds));
            }

            if (lostIds.length > 0) {
                await tx
                    .update(stakeSelections)
                    .set({status: 'LOST'})
                    .where(inArray(stakeSelections.id, lostIds));
            }
        });
    }
}