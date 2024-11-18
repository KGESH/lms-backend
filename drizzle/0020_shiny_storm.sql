ALTER TABLE "ebook_product_snapshot_previews" DROP CONSTRAINT "ebook_product_snapshot_previews_file_id_files_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "idx_ebook_product_snapshot_previews_file_id";--> statement-breakpoint
ALTER TABLE "ebook_product_snapshot_previews" ADD COLUMN "rich_text_content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ebook_product_snapshot_previews" DROP COLUMN IF EXISTS "file_id";