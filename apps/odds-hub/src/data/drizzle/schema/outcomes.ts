import {pgTable, varchar, doublePrecision, timestamp, unique, serial, } from "drizzle-orm/pg-core";
import {events} from "./events";

export const outcomes = pgTable('outcomes', {
    id: serial('id').primaryKey(),
    eventId: varchar('event_id', { length: 100 }).notNull().references(() => events.id),
    marketKey: varchar('market_key', { length: 50 }),
    name: varchar('name', { length: 100 }),
    price: doublePrecision('price').notNull(),
    point: doublePrecision('point'),
    status: varchar("status", { length: 10 }).notNull(),
}, (table) => ({
    uniqueOutcome: unique('unique_outcome').on(table.eventId, table.marketKey, table.name),
}));