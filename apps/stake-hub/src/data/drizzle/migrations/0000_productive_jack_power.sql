CREATE TABLE "stakes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"stake" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stake_selections" (
	"id" serial PRIMARY KEY NOT NULL,
	"stake_id" uuid,
	"outcome_id" integer NOT NULL,
	"price" integer NOT NULL,
	"event_name" varchar(100) NOT NULL,
	"marketName" varchar(100) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stake_selections" ADD CONSTRAINT "stake_selections_stake_id_stakes_id_fk" FOREIGN KEY ("stake_id") REFERENCES "public"."stakes"("id") ON DELETE no action ON UPDATE no action;