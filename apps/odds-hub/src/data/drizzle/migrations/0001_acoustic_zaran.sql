ALTER TABLE "events" ADD COLUMN "synced" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "is_active" boolean DEFAULT false NOT NULL;