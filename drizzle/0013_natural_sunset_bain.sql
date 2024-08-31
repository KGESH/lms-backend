CREATE TABLE IF NOT EXISTS "post_category_write_accesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"role" "user_role" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_category_access" RENAME TO "post_category_read_accesses";--> statement-breakpoint
ALTER TABLE "post_category_read_accesses" RENAME COLUMN "readable_role" TO "role";--> statement-breakpoint
ALTER TABLE "post_category_read_accesses" DROP CONSTRAINT "post_category_access_category_id_post_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "post_category_read_accesses" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "view_count" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_category_write_accesses" ADD CONSTRAINT "post_category_write_accesses_category_id_post_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_category_read_accesses" ADD CONSTRAINT "post_category_read_accesses_category_id_post_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "post_category_read_accesses" DROP COLUMN IF EXISTS "writable_role";