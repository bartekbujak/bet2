import {pgTable, timestamp, text, boolean, varchar} from "drizzle-orm/pg-core";

export const events = pgTable("events", {
    id: varchar("id", { length: 100 }).primaryKey(),
    competitionId: text("competition_id").notNull(),
    startTime: timestamp("start_time", {withTimezone: true}).notNull(),
    homeTeam: text("home_team").notNull(),
    awayTeam: text("away_team").notNull(),
    synced: boolean("synced").default(true).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
});