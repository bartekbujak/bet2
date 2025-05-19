ALTER TABLE "stake_selections" ALTER COLUMN "stake_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "stakes" ADD COLUMN "status" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "stake_selections" ADD COLUMN "status" varchar(10) NOT NULL;