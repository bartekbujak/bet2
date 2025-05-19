import {doublePrecision, integer, pgTable, serial, uuid, varchar} from "drizzle-orm/pg-core";
import {stakes} from "./stakes";
import {relations} from "drizzle-orm";

export const stakeSelections = pgTable("stake_selections", {
    id: serial("id").primaryKey(),
    stakeId: uuid("stake_id").notNull().references(() => stakes.id),
    outcomeID: integer("outcome_id").notNull(),
    price: doublePrecision("price").notNull(),
    eventName: varchar("event_name", { length: 100 }).notNull(),
    marketName: varchar("marketName", { length: 100 }).notNull(),
    status: varchar("status", { length: 10 }).notNull(),
});

export const stakeSelectionsRelations = relations(stakeSelections, ({ one }) => ({
    stake: one(stakes, {
        fields: [stakeSelections.stakeId],
        references: [stakes.id],
    }),
}));
