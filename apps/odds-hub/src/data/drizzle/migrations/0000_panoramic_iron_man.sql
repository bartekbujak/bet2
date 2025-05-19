CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"competition_id" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"home_team" text NOT NULL,
	"away_team" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outcomes" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" varchar(100),
	"market_key" varchar(50),
	"name" varchar(100),
	"price" double precision NOT NULL,
	"point" double precision,
	CONSTRAINT "unique_outcome" UNIQUE("event_id","market_key","name")
);
--> statement-breakpoint
ALTER TABLE "outcomes" ADD CONSTRAINT "outcomes_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;