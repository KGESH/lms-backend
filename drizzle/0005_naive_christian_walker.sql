CREATE TABLE IF NOT EXISTS "course_product_snapshot_announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_snapshot_id" uuid NOT NULL,
	"rich_text_content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_product_snapshot_refund_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_snapshot_id" uuid NOT NULL,
	"rich_text_content" text NOT NULL
);
