ALTER TABLE "ebook_product_snapshots" ADD COLUMN "available_days" integer;--> statement-breakpoint
ALTER TABLE "course_orders" ADD COLUMN "valid_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ebook_orders" ADD COLUMN "valid_until" timestamp with time zone;