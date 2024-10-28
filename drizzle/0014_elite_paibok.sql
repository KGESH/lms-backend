ALTER TABLE "ebook_contents" ADD COLUMN "file_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ebook_contents" ADD CONSTRAINT "ebook_contents_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_contents_file_id" ON "ebook_contents" USING btree ("file_id");--> statement-breakpoint
ALTER TABLE "ebook_contents" DROP COLUMN IF EXISTS "url";