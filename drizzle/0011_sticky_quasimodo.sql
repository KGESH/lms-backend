ALTER TABLE "review_replies" DROP CONSTRAINT "review_replies_parent_id_review_replies_id_fk";
--> statement-breakpoint
ALTER TABLE "course_reviews" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "course_reviews" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ebook_reviews" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "ebook_reviews" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "review_replies" DROP COLUMN IF EXISTS "parent_id";