CREATE TABLE IF NOT EXISTS "ebook_product_snapshot_ui_contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_snapshot_id" uuid NOT NULL,
	"type" "product_ui_content_type" NOT NULL,
	"content" text NOT NULL,
	"description" text,
	"sequence" integer,
	"url" text,
	"metadata" text
);
