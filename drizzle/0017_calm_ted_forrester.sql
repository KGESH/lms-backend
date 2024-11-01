CREATE TABLE IF NOT EXISTS "ebook_product_snapshot_previews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_snapshot_id" uuid NOT NULL,
	"file_id" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ebook_product_snapshot_previews" ADD CONSTRAINT "ebook_product_snapshot_previews_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_product_snapshot_previews_product_snapshot_id" ON "ebook_product_snapshot_previews" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_product_snapshot_previews_file_id" ON "ebook_product_snapshot_previews" USING btree ("file_id");