DO $$ BEGIN
 CREATE TYPE "public"."product_type" AS ENUM('course', 'ebook');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"product_type" "product_type" NOT NULL,
	"payment_method" text NOT NULL,
	"amount" numeric NOT NULL,
	"paid_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "course_order_refunds" RENAME COLUMN "course_order_id" TO "order_id";--> statement-breakpoint
ALTER TABLE "course_orders" ADD COLUMN "order_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "course_orders" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "course_orders" DROP COLUMN IF EXISTS "payment_method";--> statement-breakpoint
ALTER TABLE "course_orders" DROP COLUMN IF EXISTS "amount";--> statement-breakpoint
ALTER TABLE "course_orders" DROP COLUMN IF EXISTS "paid_at";