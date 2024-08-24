ALTER TABLE "ebook_reviews" ALTER COLUMN "ebook_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ebook_reviews" ADD CONSTRAINT "ebook_reviews_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ebook_reviews" ADD CONSTRAINT "ebook_reviews_ebook_id_ebooks_id_fk" FOREIGN KEY ("ebook_id") REFERENCES "public"."ebooks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
