ALTER TABLE "events" ALTER COLUMN "id" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "synced" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "is_active" SET DEFAULT true;