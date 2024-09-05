ALTER TABLE "post_category_read_accesses" DROP CONSTRAINT "post_category_read_accesses_category_id_post_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "post_category_write_accesses" DROP CONSTRAINT "post_category_write_accesses_category_id_post_categories_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_category_read_accesses" ADD CONSTRAINT "post_category_read_accesses_category_id_post_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_category_write_accesses" ADD CONSTRAINT "post_category_write_accesses_category_id_post_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
