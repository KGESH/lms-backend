ALTER TABLE "course_enrollments" ADD COLUMN "valid_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ebook_enrollments" ADD COLUMN "valid_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "course_orders" DROP COLUMN IF EXISTS "valid_until";--> statement-breakpoint
ALTER TABLE "ebook_orders" DROP COLUMN IF EXISTS "valid_until";