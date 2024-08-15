CREATE TABLE IF NOT EXISTS "course_order_refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_order_id" uuid NOT NULL,
	"refunded_amount" numeric NOT NULL,
	"refunded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"course_product_snapshot_id" uuid NOT NULL,
	"payment_method" text NOT NULL,
	"amount" numeric NOT NULL,
	"paid_at" timestamp with time zone
);
