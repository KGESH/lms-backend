ALTER TABLE "reviews" ADD COLUMN "deleted_by" uuid;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "deleted_reason" text;