CREATE TABLE IF NOT EXISTS "course_product_snapshot_contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_product_snapshot_id" uuid NOT NULL,
	"rich_text_content" text NOT NULL
);
