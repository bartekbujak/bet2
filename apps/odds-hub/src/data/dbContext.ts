import {container, injectable} from 'tsyringe';
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres"
import {DrizzleOddsRepository} from "./repository/oddsRepository";

export interface IDbContext {
    database: NodePgDatabase;
}

@injectable()
export class DbContext implements IDbContext {
    public database:NodePgDatabase;

    constructor(connectionString: string) {
        this.database = drizzle(connectionString);
    }
}

export const initialDbContext = async (connectionString: string): Promise<void> => {
    container.register("IDbContext", {useValue: new DbContext(connectionString)});
    // init repositories
    container.register("IOddsRepository", {
        useClass: DrizzleOddsRepository
    });
};