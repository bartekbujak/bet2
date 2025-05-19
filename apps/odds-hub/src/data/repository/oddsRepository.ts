import {inject, singleton} from "tsyringe";
import type {IDbContext} from "../dbContext";
import {Event} from "../../service/oddsProvider/oddsProvider";
import {events as schemaEvents} from "../drizzle/schema/events";
import {and, eq} from "drizzle-orm";
import {outcomes} from "../drizzle/schema/outcomes";
import {OddsDto} from "../../dto/oddsDto";

export interface IOddsRepository {
    saveEvents(events: Event[], competitionId: string): Promise<void>;
    getEvents(excludePending: boolean): Promise<OddsDto[]>;
    updateScores(): Promise<void>;
}

@singleton()
export class DrizzleOddsRepository implements IOddsRepository {
    constructor(@inject("IDbContext") private readonly dbContext: IDbContext) {}

    async updateScores(): Promise<void> {
        const updateOutcomesStatusSql = `
  UPDATE outcomes
  SET status = CASE
    WHEN random() < 0.5 THEN 'WIN'
    ELSE 'LOST'
  END
  WHERE status = 'PENDING'
    AND EXISTS (
      SELECT 1
      FROM events
      WHERE events.id = outcomes.event_id
        AND events.start_time <= NOW() - INTERVAL '5 hours'
    )
`;

        await this.dbContext.database.execute(updateOutcomesStatusSql);
    }

    async getEvents(excludePending: boolean): Promise<OddsDto[]> {
        const sql = `
    SELECT
      e.id AS eventId,
      e.competition_id AS competitionId,
      e.start_time AS startDate,
      e.home_team AS homeTeam,
      e.away_team AS awayTeam,
      o.id AS outcomeId,
      o.market_key AS marketKey,
      o.name AS name,
      o.price AS price,
      o.point AS point,
      o.status AS status
    FROM events e
    LEFT JOIN outcomes o ON e.id = o.event_id
    ${excludePending ? "WHERE o.status IS NOT NULL AND o.status != 'PENDING'" : "WHERE o.status = 'PENDING'"}
  `;

        const result = await this.dbContext.database.execute(sql);

        const rows = Array.isArray(result) ? result : result.rows;

        return rows.map(row => ({
            eventId: row.eventid,
            competitionId: row.competitionid,
            marketKey: row.marketkey,
            startDate: new Date(row.startdate),
            homeTeam: row.hometeam,
            awayTeam: row.awayteam,
            outcomeId: row.outcomeid,
            name: row.name,
            status: row.status,
            price: Number(row.price),
            point: row.point !== null ? Number(row.point) : null,
        }));

    }


    async saveEvents(events: Event[], competitionId: string): Promise<void> {
        if (events.length === 0) return;

        try {
            await this.dbContext.database.transaction(async (tx) => {
                await this.dbContext.database
                    .update(schemaEvents)
                    .set({ synced: false })
                    .where(eq(schemaEvents.competitionId, competitionId));
                await this.upsertEvents(events);
                await this.upsertOutcomes(events);
                await this.dbContext.database
                    .update(schemaEvents)
                    .set({
                        isActive: false,
                    })
                    .where(
                        and(
                            eq(schemaEvents.competitionId, competitionId),
                            eq(schemaEvents.synced, false)
                        )
                    );
                console.info(`✅ Transaction completed successfully for competitionId=${competitionId}`);
            });
        } catch (error) {
            const err = error as Error;
            console.error(`An error occurred for competitionId=${competitionId}: ${err.message}`);
            await this.dbContext.database
                .update(schemaEvents)
                .set({
                    isActive: false,
                    synced:false,
                })
                .where(eq(schemaEvents.competitionId, competitionId));
        }
    }

    private async upsertEvents(events: Event[]):Promise<void> {
        await this.dbContext.database
            .insert(schemaEvents)
            .values(events.map((event) => ({
                id: event.id,
                competitionId: event.competitionId,
                startTime: new Date(event.startTime),
                homeTeam: event.home_team,
                awayTeam: event.away_team,
            })))
            .onConflictDoUpdate({
                target: schemaEvents.id,
                set: {
                    competitionId: schemaEvents.competitionId,
                    startTime: schemaEvents.startTime,
                    homeTeam: schemaEvents.homeTeam,
                    awayTeam: schemaEvents.awayTeam,
                    synced: true,
                },
            });
    }

    private async upsertOutcomes(events: Event[]):Promise<void> {
        await this.dbContext.database
            .insert(outcomes)
            .values(
                events.flatMap(event =>
                    event.odds.flatMap(market =>
                        market.outcomes.map(outcome => ({
                            eventId: event.id,
                            marketKey: market.key,
                            name: outcome.name,
                            price: outcome.price,
                            status: 'PENDING',
                            point: outcome.point ?? null,
                        }))
                    )
                )
            )
            .onConflictDoUpdate({
                target: [outcomes.eventId, outcomes.marketKey, outcomes.name],
                set: {
                    price: outcomes.price,
                },
            });
    }
}