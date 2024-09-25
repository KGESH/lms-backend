DO $$ BEGIN
 CREATE TYPE "public"."file_type" AS ENUM('video', 'image', 'text', 'file');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "product_ui_content_type" ADD VALUE 'badge';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"type" "file_type" NOT NULL,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "course_product_snapshots" ADD COLUMN "thumbnail_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "ebook_product_snapshots" ADD COLUMN "thumbnail_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_product_snapshots" ADD CONSTRAINT "course_product_snapshots_product_id_course_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."course_products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_product_snapshots" ADD CONSTRAINT "course_product_snapshots_thumbnail_id_files_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ebook_product_snapshots" ADD CONSTRAINT "ebook_product_snapshots_thumbnail_id_files_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user_terms" ADD CONSTRAINT "user_terms_user_id_term_id_unique" UNIQUE("user_id","term_id");