ALTER TABLE "course_product_snapshot_ui_contents" ADD COLUMN "file_id" uuid;--> statement-breakpoint
ALTER TABLE "ebook_product_snapshot_ui_contents" ADD COLUMN "file_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_product_snapshot_ui_contents" ADD CONSTRAINT "course_product_snapshot_ui_contents_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ebook_product_snapshot_ui_contents" ADD CONSTRAINT "ebook_product_snapshot_ui_contents_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_product_snapshot_ui_contents_file_id" ON "course_product_snapshot_ui_contents" USING btree ("file_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_product_snapshot_ui_contents_file_id" ON "ebook_product_snapshot_ui_contents" USING btree ("file_id");--> statement-breakpoint
ALTER TABLE "course_product_snapshot_ui_contents" DROP COLUMN IF EXISTS "url";--> statement-breakpoint
ALTER TABLE "ebook_product_snapshot_ui_contents" DROP COLUMN IF EXISTS "url";