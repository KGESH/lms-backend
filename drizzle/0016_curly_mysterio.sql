CREATE TABLE IF NOT EXISTS "ebook_product_snapshot_table_of_contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_snapshot_id" uuid NOT NULL,
	"rich_text_content" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_product_snapshot_table_of_contents_product_snapshot_id" ON "ebook_product_snapshot_table_of_contents" USING btree ("product_snapshot_id");