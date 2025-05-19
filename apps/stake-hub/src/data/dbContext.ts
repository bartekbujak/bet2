import {container, injectable} from 'tsyringe';
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres"
import {DrizzleStakeRepository} from "./repository/stakeRepository";
import * as schema from './drizzle/schema';

export interface IDbContext {
    database: NodePgDatabase<typeof schema>;
}

@injectable()
export class DbContext implements IDbContext {
    public database: NodePgDatabase<typeof schema>;

    constructor(connectionString: string) {
        this.database = drizzle({ connection: connectionString, schema});
    }
}

export const initialDbContext = async (connectionString: string): Promise<void> => {
    container.register("IDbContext", {useValue: new DbContext(connectionString)});
    // init repositories
    container.register("IStakeRepository", {
        useClass: DrizzleStakeRepository
    });
};