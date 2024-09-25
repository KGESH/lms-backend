ALTER TABLE "otps" RENAME COLUMN "user_id" TO "identifier";--> statement-breakpoint
ALTER TABLE "otps" ALTER COLUMN "identifier" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "otps" ALTER COLUMN "identifier" SET NOT NULL;