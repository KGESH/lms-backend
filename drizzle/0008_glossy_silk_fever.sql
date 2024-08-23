CREATE TABLE IF NOT EXISTS "ebook_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ebookContents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ebook_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content_type" "lesson_content_type" NOT NULL,
	"url" text,
	"metadata" text,
	"sequence" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ebook_product_snapshot_announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_snapshot_id" uuid NOT NULL,
	"rich_text_content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ebook_product_snapshot_contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_snapshot_id" uuid NOT NULL,
	"rich_text_content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ebook_product_snapshot_discounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_snapshot_id" uuid NOT NULL,
	"discount_type" "discount_type" NOT NULL,
	"value" numeric NOT NULL,
	"valid_from" timestamp with time zone,
	"valid_to" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ebook_product_snapshot_pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_snapshot_id" uuid NOT NULL,
	"amount" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ebook_product_snapshot_refund_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_snapshot_id" uuid NOT NULL,
	"rich_text_content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ebook_product_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ebook_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ebook_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ebooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ebook_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_snapshot_id" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ebook_categories" ADD CONSTRAINT "ebook_categories_parent_id_ebook_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ebook_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
