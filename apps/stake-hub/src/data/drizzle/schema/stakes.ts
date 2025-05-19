import {pgTable, serial, text, integer, doublePrecision, timestamp, varchar, uuid} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {stakeSelections} from "./stakeSelections";

export const stakes = pgTable("stakes", {
    id: uuid("id").primaryKey(),
    stake: doublePrecision("stake").notNull(),
    total: doublePrecision("total").notNull(),
    status: varchar("status", { length: 10 }).notNull(),
});

export const stakesRelations = relations(stakes, ({ many }) => ({
    selections: many(stakeSelections),
}));

