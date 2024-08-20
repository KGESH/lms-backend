ALTER TABLE "review_comments" RENAME TO "review_replies";--> statement-breakpoint
ALTER TABLE "review_comment_snapshots" RENAME TO "review_reply_snapshots";--> statement-breakpoint
ALTER TABLE "review_reply_snapshots" RENAME COLUMN "review_comment_id" TO "review_reply_id";--> statement-breakpoint
ALTER TABLE "review_reply_snapshots" DROP CONSTRAINT "review_comment_snapshots_review_comment_id_review_comments_id_fk";
--> statement-breakpoint
ALTER TABLE "review_replies" DROP CONSTRAINT "review_comments_review_id_reviews_id_fk";
--> statement-breakpoint
ALTER TABLE "review_replies" DROP CONSTRAINT "review_comments_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "review_replies" DROP CONSTRAINT "review_comments_parent_id_review_comments_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_reply_snapshots" ADD CONSTRAINT "review_reply_snapshots_review_reply_id_review_replies_id_fk" FOREIGN KEY ("review_reply_id") REFERENCES "public"."review_replies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_replies" ADD CONSTRAINT "review_replies_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_replies" ADD CONSTRAINT "review_replies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "review_replies" ADD CONSTRAINT "review_replies_parent_id_review_replies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."review_replies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
