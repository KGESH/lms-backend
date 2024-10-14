ALTER TABLE "course_reviews" DROP CONSTRAINT "course_reviews_course_id_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "ebook_reviews" DROP CONSTRAINT "ebook_reviews_ebook_id_ebooks_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ebook_reviews" ADD CONSTRAINT "ebook_reviews_ebook_id_ebooks_id_fk" FOREIGN KEY ("ebook_id") REFERENCES "public"."ebooks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
