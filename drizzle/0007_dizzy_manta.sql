ALTER TABLE "course_reviews" DROP CONSTRAINT "course_reviews_review_id_reviews_id_fk";
--> statement-breakpoint
ALTER TABLE "ebook_reviews" DROP CONSTRAINT "ebook_reviews_review_id_reviews_id_fk";
--> statement-breakpoint
ALTER TABLE "review_replies" DROP CONSTRAINT "review_replies_review_id_reviews_id_fk";
--> statement-breakpoint
ALTER TABLE "review_reply_snapshots" DROP CONSTRAINT "review_reply_snapshots_review_reply_id_review_replies_id_fk";
--> statement-breakpoint
ALTER TABLE "review_snapshots" DROP CONSTRAINT "review_snapshots_review_id_reviews_id_fk";
--> statement-breakpoint
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ebook_reviews" ADD CONSTRAINT "ebook_reviews_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_replies" ADD CONSTRAINT "review_replies_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_reply_snapshots" ADD CONSTRAINT "review_reply_snapshots_review_reply_id_review_replies_id_fk" FOREIGN KEY ("review_reply_id") REFERENCES "public"."review_replies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_snapshots" ADD CONSTRAINT "review_snapshots_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
